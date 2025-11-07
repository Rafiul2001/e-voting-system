import dotenv from "dotenv";

dotenv.config();

export const CollectionListNames = {
  OPERATOR: "operator",
  MACHINE: "machine",
  ADMIN: "admin",
} as const;

interface IConfig {
  port: number;
  mongodbUrl: string;
  databaseName: string;
  collectionList: (typeof CollectionListNames)[keyof typeof CollectionListNames][];
  jwtPrivateKey: string;
}

const config: IConfig = {
  port: Number(process.env.PORT) || 3001,
  mongodbUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/",
  databaseName: process.env.DATABASE_NAME || "districtCommissionAdminPanel",
  collectionList: [
    CollectionListNames.ADMIN,
    CollectionListNames.MACHINE,
    CollectionListNames.OPERATOR,
  ],
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "privatekey",
};

export default config;
