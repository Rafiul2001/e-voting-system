import { NextFunction, Request, Response, Router } from "express";
import { adminLoginBody } from "../../shared/validators/adminValidator";
import { database } from "../mongodb_connection/connection";
import { AdminModel } from "../models/adminModel";
import { CollectionListNames } from "../config/config";
import { verifyToken } from "../middlewares/verifyToken";

const adminRouter = Router();

// Login route
adminRouter.post(
  "/login",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = adminLoginBody.parse(req.body);
      const data = await database
        .collection<AdminModel>(CollectionListNames.ADMIN)
        .findOne({
          userName: userName,
          password: password,
        });

      if (!data) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      res.status(200).json({
        message: "Login Successful",
        data: {
          userEmail: data?.userEmail,
          userName: data?.userName,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default adminRouter;
