import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const machineRouter = Router();

// Machine can cast vote

export default machineRouter;
