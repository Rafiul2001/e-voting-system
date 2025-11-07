import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const permitRouter = Router();

// Machine can cast vote

export default permitRouter;
