"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionListNames = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CollectionListNames = {
    VOTER: "voter",
    CONSTITUENCY: "constituency",
    CANDIDATE: "candidate",
    USER: "user"
};
const config = {
    port: Number(process.env.PORT) || 3000,
    mongodbUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/",
    databaseName: process.env.DATABASE_NAME || "adminPanel",
    collectionList: [exports.CollectionListNames.USER, exports.CollectionListNames.CANDIDATE, exports.CollectionListNames.CONSTITUENCY, exports.CollectionListNames.VOTER],
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "privatekey"
};
exports.default = config;
