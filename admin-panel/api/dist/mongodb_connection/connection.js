"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("../config/config"));
const url = config_1.default.mongodbUrl;
const client = new mongodb_1.MongoClient(url, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        const exists = dbs.databases.some(db => db.name === config_1.default.databaseName);
        if (!exists) {
            console.log(`Database ${config_1.default.databaseName} does not exist. Creating it now.`);
            const collectionList = config_1.default.collectionList.map((coll_name) => {
                client.db(config_1.default.databaseName).createCollection(coll_name);
            });
            await Promise.all(collectionList);
            console.log(`Database ${config_1.default.databaseName} created with collection ${collectionList}.`);
        }
        else {
            console.log(`Database ${config_1.default.databaseName} already exists.`);
        }
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
exports.connectToDatabase = connectToDatabase;
exports.database = client.db(config_1.default.databaseName);
