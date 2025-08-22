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
exports.VoteTallyContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const crypto = __importStar(require("crypto"));
const PREFIX = {
    TALLY: "TALLY", // TALLY#electionId#constituencyId#candidateId
};
function sha256Hex(s) {
    return crypto.createHash("sha256").update(s).digest("hex");
}
let VoteTallyContract = class VoteTallyContract extends fabric_contract_api_1.Contract {
    // Casting Vote
    async CastVote(ctx, electionId, constituencyId, candidateId, permit) {
        this._require(electionId && constituencyId && candidateId && permit, "electionId, constituencyId, candidateId, and permit are required");
        const permitHash = sha256Hex(permit);
        const ccAName = "voterpermitcc";
        const resp = await ctx.stub.invokeChaincode(ccAName, ["ValidateAndSpendPermit", electionId, permitHash], "mychannel");
        if (resp.status !== 200) {
            throw new Error(`ValidateAndSpendPermit failed: status ${resp.status}, message: ${resp.message}`);
        }
        // Get the transaction timestamp (deterministic across peers)
        const txTimestamp = ctx.stub.getTxTimestamp();
        const updatedAt = new Date(txTimestamp.seconds.low * 1000).toISOString();
        const tallyKey = ctx.stub.createCompositeKey(PREFIX.TALLY, [
            electionId,
            constituencyId,
            candidateId,
        ]);
        const currentBytes = await ctx.stub.getState(tallyKey);
        let rec;
        // const now = new Date().toISOString();
        if (!currentBytes || !currentBytes.length) {
            rec = {
                electionId,
                constituencyId,
                candidateId,
                voteCount: 1,
                updatedAt: updatedAt,
            };
        }
        else {
            rec = JSON.parse(currentBytes.toString());
            rec.voteCount += 1;
            rec.updatedAt = updatedAt;
        }
        await ctx.stub.putState(tallyKey, Buffer.from(JSON.stringify(rec)));
        return JSON.stringify({ ok: true, tally: rec.voteCount });
    }
    // Get tally for a specific candidate in a constituency
    async GetCandidateTally(ctx, electionId, constituencyId, candidateId) {
        this._require(electionId && constituencyId && candidateId, "missing inputs");
        const key = ctx.stub.createCompositeKey(PREFIX.TALLY, [
            electionId,
            constituencyId,
            candidateId,
        ]);
        const bytes = await ctx.stub.getState(key);
        if (!bytes || !bytes.length) {
            return JSON.stringify({
                electionId,
                constituencyId,
                candidateId,
                voteCount: 0,
            });
        }
        return bytes.toString();
    }
    // Get all tallies for a constituency (returns an array)
    async GetConstituencyTallies(ctx, electionId, constituencyId) {
        this._require(electionId && constituencyId, "missing inputs");
        const iter = await ctx.stub.getStateByPartialCompositeKey(PREFIX.TALLY, [
            electionId,
            constituencyId,
        ]);
        const results = [];
        try {
            while (true) {
                const res = await iter.next();
                if (res.value && res.value.value) {
                    const record = JSON.parse(res.value.value.toString());
                    results.push(record);
                }
                if (res.done) {
                    await iter.close();
                    break;
                }
            }
        }
        finally {
            await iter.close(); // make sure it's always closed
        }
        return JSON.stringify(results);
    }
    // Get all tallies for an election (across all constituency)
    async GetElectionTallies(ctx, electionId) {
        this._require(electionId, "missing electionId");
        const iter = await ctx.stub.getStateByPartialCompositeKey(PREFIX.TALLY, [
            electionId,
        ]);
        const results = [];
        try {
            while (true) {
                const res = await iter.next();
                if (res.value && res.value.value) {
                    const record = JSON.parse(res.value.value.toString());
                    results.push(record);
                }
                if (res.done) {
                    await iter.close();
                    break;
                }
            }
        }
        finally {
            await iter.close(); // make sure it's always closed
        }
        return JSON.stringify(results);
    }
    _require(cond, msg) {
        if (!cond)
            throw new Error(msg);
    }
};
exports.VoteTallyContract = VoteTallyContract;
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VoteTallyContract.prototype, "CastVote", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], VoteTallyContract.prototype, "GetCandidateTally", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], VoteTallyContract.prototype, "GetConstituencyTallies", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], VoteTallyContract.prototype, "GetElectionTallies", null);
exports.VoteTallyContract = VoteTallyContract = __decorate([
    (0, fabric_contract_api_1.Info)({
        title: "VoteTallyContract",
        description: "Vote Tally Smart Contract, using State Based Endorsement(SBE), implemented in TypeScript",
    })
], VoteTallyContract);
//# sourceMappingURL=voteTallyContract.js.map