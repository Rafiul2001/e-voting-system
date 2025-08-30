import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { database } from "../mongodb_connection/connection";
import { ElectionModel } from "../models/electionModel";
import { CollectionListNames } from "../config/config";
import {
  createElectionBody,
  deleteElectionParams,
} from "../../shared/validators/electionValidator";
import { ObjectId } from "mongodb";
import { CandidateModel } from "../models/candidateModel";

const electionRouter = Router();

// Get election list
electionRouter.get(
  "/all-election",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const electionList = await database
        .collection<ElectionModel>(CollectionListNames.ELECTION)
        .find()
        .toArray();

      return res.status(200).json({
        message: "Successfully get election list",
        electionList: electionList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create an Election
electionRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionName } = createElectionBody.parse(req.body);

      const exists = await database
        .collection<ElectionModel>(CollectionListNames.ELECTION)
        .findOne({
          electionName: electionName,
        });

      if (exists)
        return res.status(409).json({
          message: "Election name exists",
        });

      const newElection = new ElectionModel(electionName);

      await database
        .collection<ElectionModel>(CollectionListNames.ELECTION)
        .insertOne(newElection);

      return res.status(200).json({
        message: "A new election has been created",
        election: newElection,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete an election
electionRouter.delete(
  "/delete/:electionId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { electionId } = deleteElectionParams.parse(req.params);

      const data = await database
        .collection<ElectionModel>(CollectionListNames.ELECTION)
        .findOneAndDelete({
          _id: new ObjectId(electionId),
        });

      if (!data)
        return res.status(404).json({
          message: "Election not found",
        });

      await database
        .collection<CandidateModel>(CollectionListNames.CANDIDATE)
        .deleteMany({
          electionId: new ObjectId(electionId),
        });

      return res.status(200).json({
        message: "Election has been deleted",
        election: data,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default electionRouter;
