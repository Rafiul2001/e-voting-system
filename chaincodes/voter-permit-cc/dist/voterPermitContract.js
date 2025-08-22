"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoterPermitContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const record_1 = require("./record");
const crypto = __importStar(require("crypto"));
const PREFIX = {
    VOTER: 'VOTER', // VOTER#electionId#voterHash
    PERMIT: 'PERMIT', // PERMIT#electionId#permitHash
};
function sha256Hex(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}
let VoterPermitContract = class VoterPermitContract extends fabric_contract_api_1.Contract {
    /**
      * IssuePermit
      * - Client provides: electionId, voterHash (already hashed off-chain), permit (random string)
      * - Writes:
      *   - VOTER#electionId#voterHash -> { electionId, voterHash, issuedAt }
      *   - PERMIT#electionId#permitHash (status=issued)
      * - Throws if voter already has a permit for this election or permit already exists
      */
    async IssuePermit(ctx, electionId, voterHash, permit) {
        this._require(electionId && voterHash && permit, 'electionId, voterHash, and permit are required');
        const voterKey = ctx.stub.createCompositeKey(PREFIX.VOTER, [electionId, voterHash]);
        const voterBytes = await ctx.stub.getState(voterKey);
        if (voterBytes && voterBytes.length) {
            throw new Error('Permit already issued for this voter in this election');
        }
        const permitHash = sha256Hex(permit);
        const permitKey = ctx.stub.createCompositeKey(PREFIX.PERMIT, [electionId, permitHash]);
        const permitBytes = await ctx.stub.getState(permitKey);
        if (permitBytes && permitBytes.length) {
            throw new Error('Permit already exists (hash collision / reuse)');
        }
        const now = new Date().toISOString();
        const voterRec = { electionId, voterHash, issuedAt: now };
        const permitRec = { electionId, permitHash, status: record_1.PermitStatus.ISSUED, issuedAt: now };
        await ctx.stub.putState(voterKey, Buffer.from(JSON.stringify(voterRec)));
        await ctx.stub.putState(permitKey, Buffer.from(JSON.stringify(permitRec)));
        // Return permitHash so the client can keep only the hash if desired
        return JSON.stringify({ permitHash });
    }
    /**
   * HasVoted (aka has permit issued)
   * - Returns true if a permit has already been issued to this voter for this election.
   *   (You can treat "issued" as "has voted/used opportunity", since the permit can only be spent once.)
   */
    async HasVoted(ctx, electionId, voterHash) {
        this._require(electionId && voterHash, 'electionId and voterHash are required');
        const voterKey = ctx.stub.createCompositeKey(PREFIX.VOTER, [electionId, voterHash]);
        const voterBytes = await ctx.stub.getState(voterKey);
        return JSON.stringify({ has: !!(voterBytes && voterBytes.length) });
    }
    /**
    * ValidateAndSpendPermit (INTERNAL - called by other chaincode)
    * - Input: electionId, permitHash
    * - Ensures the permit exists and is in 'issued' state, then marks it 'spent'.
    * - Returns "OK" on success.
    */
    async ValidateAndSpendPermit(ctx, electionId, permitHash) {
        this._require(electionId && permitHash, 'electionId and permitHash are required');
        const permitKey = ctx.stub.createCompositeKey(PREFIX.PERMIT, [electionId, permitHash]);
        const permitBytes = await ctx.stub.getState(permitKey);
        if (!permitBytes || !permitBytes.length) {
            throw new Error('Permit not found');
        }
        const rec = JSON.parse(permitBytes.toString());
        if (rec.status !== 'issued') {
            throw new Error('Permit already spent or invalid');
        }
        rec.status = record_1.PermitStatus.SPENT;
        rec.spentAt = new Date().toISOString();
        await ctx.stub.putState(permitKey, Buffer.from(JSON.stringify(rec)));
        return 'OK';
    }
    // Utility guard
    _require(cond, msg) {
        if (!cond)
            throw new Error(msg);
    }
};
exports.VoterPermitContract = VoterPermitContract;
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], VoterPermitContract.prototype, "IssuePermit", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], VoterPermitContract.prototype, "HasVoted", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], VoterPermitContract.prototype, "ValidateAndSpendPermit", null);
exports.VoterPermitContract = VoterPermitContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'VoterPermitContract', description: 'Voter Permit Smart Contract, using State Based Endorsement(SBE), implemented in TypeScript' })
], VoterPermitContract);
//# sourceMappingURL=voterPermitContract.js.map