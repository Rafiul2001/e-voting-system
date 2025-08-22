"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const connection_1 = require("./mongodb_connection/connection");
(0, connection_1.connectToDatabase)();
app_1.default.listen(config_1.default.port, () => {
    console.log(`Server running on port http://localhost:${config_1.default.port}`);
});
