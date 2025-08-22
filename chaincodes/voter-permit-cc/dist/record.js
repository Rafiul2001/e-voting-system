"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermitRecord = exports.VoterRecord = exports.PermitStatus = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
exports.PermitStatus = {
    ISSUED: "issued",
    SPENT: "spent"
};
let VoterRecord = class VoterRecord {
    electionId = '';
    voterHash = '';
    issuedAt = '';
};
exports.VoterRecord = VoterRecord;
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], VoterRecord.prototype, "electionId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], VoterRecord.prototype, "voterHash", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], VoterRecord.prototype, "issuedAt", void 0);
exports.VoterRecord = VoterRecord = __decorate([
    (0, fabric_contract_api_1.Object)()
], VoterRecord);
let PermitRecord = class PermitRecord {
    electionId = '';
    permitHash = '';
    status = exports.PermitStatus.ISSUED;
    issuedAt = '';
    spentAt = '';
};
exports.PermitRecord = PermitRecord;
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], PermitRecord.prototype, "electionId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], PermitRecord.prototype, "permitHash", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], PermitRecord.prototype, "status", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], PermitRecord.prototype, "issuedAt", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], PermitRecord.prototype, "spentAt", void 0);
exports.PermitRecord = PermitRecord = __decorate([
    (0, fabric_contract_api_1.Object)()
], PermitRecord);
//# sourceMappingURL=record.js.map