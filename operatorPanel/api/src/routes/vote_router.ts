import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const voteRouter = Router();

// Machine can cast vote

export default voteRouter;
