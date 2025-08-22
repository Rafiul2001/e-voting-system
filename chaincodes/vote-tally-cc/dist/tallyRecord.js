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
exports.TallyRecord = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let TallyRecord = class TallyRecord {
    electionId = '';
    constituencyId = '';
    candidateId = '';
    voteCount = 0;
    updatedAt = "";
};
exports.TallyRecord = TallyRecord;
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], TallyRecord.prototype, "electionId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], TallyRecord.prototype, "constituencyId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], TallyRecord.prototype, "candidateId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", Number)
], TallyRecord.prototype, "voteCount", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], TallyRecord.prototype, "updatedAt", void 0);
exports.TallyRecord = TallyRecord = __decorate([
    (0, fabric_contract_api_1.Object)()
], TallyRecord);
//# sourceMappingURL=tallyRecord.js.map