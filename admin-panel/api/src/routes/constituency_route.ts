import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { database } from "../mongodb_connection/connection";
import { CollectionListNames } from "../config/config";
import { ConstituencyModel } from "../models/constituencyModel";
import {
  createNewConstituencyBody,
  deleteConstituencyParams,
} from "../../shared/validators/constituencyValidator";
import { ObjectId } from "mongodb";
import { VoterModel } from "../models/voterModel";

const constituencyRouter = Router();

// Get all constituency list
constituencyRouter.get(
  "/get-all",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const constituencyList = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .find()
        .toArray();

      res.status(200).json({
        message: "Successfully get Constituency List",
        constituencyList: constituencyList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create a new constituency
constituencyRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyName } = createNewConstituencyBody.parse(req.body);

      const constituency = new ConstituencyModel(constituencyName);

      await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .insertOne(constituency);

      res.status(200).json({
        message: "Successfully created a new constituency",
        constituency: constituency,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a constituency
constituencyRouter.delete(
  "/delete/:constituencyId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyId } = deleteConstituencyParams.parse(req.params);

      const existsVoter = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .find({ constituencyId: new ObjectId(constituencyId) })
        .toArray();

      if (existsVoter.length > 0)
        res.status(409).json({
          message:
            "Can not delete this constituency. Please update the voters list first with this constituency",
        });

      const deletedItem = await database
        .collection<ConstituencyModel>(CollectionListNames.CONSTITUENCY)
        .findOneAndDelete({ _id: new ObjectId(constituencyId) });

      if (!deletedItem) {
        return res.status(404).json({ message: "Constituency not found" });
      }

      res.status(200).json({
        message: "Constituency deleted successfully",
        constituency: deletedItem,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default constituencyRouter;
