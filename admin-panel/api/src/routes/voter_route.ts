import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createVoterBody,
  deleteVoterParams,
  getAllVotersParams,
  updateVoterBody,
  updateVoterParams,
} from "../../shared/validators/voterValidator";
import { database } from "../mongodb_connection/connection";
import { VoterModel } from "../models/voterModel";
import { CollectionListNames } from "../config/config";
import { ObjectId } from "mongodb";

const voterRouter = Router();

// Get all voters
voterRouter.get(
  "/get-all/:constituencyId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { constituencyId } = getAllVotersParams.parse(req.params);
      const voterList = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .find({
          constituencyId: new ObjectId(constituencyId),
        })
        .toArray();

      return res.status(200).json({
        message: "Successfully get all voters",
        voterList: voterList,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create Voter
voterRouter.post(
  "/create",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { voterId, constituencyId, voterName, dateOfBirth, address } =
        createVoterBody.parse(req.body);

      // Validate constituencyId
      if (!ObjectId.isValid(constituencyId)) {
        return res.status(400).json({
          message: "Invalid constituencyId format",
        });
      }

      const newVoter = new VoterModel(
        voterId,
        new ObjectId(constituencyId),
        voterName,
        dateOfBirth,
        address
      );

      const exist = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOne({
          voterId: voterId,
        });

      if (exist)
        return res.status(409).json({
          message: "VoterId already exists",
        });

      await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .insertOne(newVoter);

      return res.status(200).json({
        message: "Successfully created a new voter",
        voter: newVoter,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a voter
voterRouter.delete(
  "/delete/:voterObjectId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { voterObjectId } = deleteVoterParams.parse(req.params);

      const data = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOneAndDelete({
          _id: new ObjectId(voterObjectId),
        });

      if (!data)
        return res.status(404).json({
          message: "Voter does not exists",
        });

      return res.status(200).json({
        message: "Successfully deleted voter",
        voter: {
          _id: data?._id,
          voterId: data?.voterId,
          constituencyId: data?.constituencyId,
          voterName: data?.voterName,
          dateOfBirth: data?.dateOfBirth,
          address: data?.address,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update a voter
voterRouter.put(
  "/update/:voterObjectId",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { voterObjectId } = updateVoterParams.parse(req.params);

      const { constituencyId, voterName, dateOfBirth, address } =
        updateVoterBody.parse(req.body);

      const updateFields: any = {};

      // Add only fields that exist in the request
      if (constituencyId)
        updateFields.constituencyId = new ObjectId(constituencyId);
      if (voterName) updateFields.voterName = voterName;
      if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
      if (address) updateFields.address = address;

      const data = await database
        .collection<VoterModel>(CollectionListNames.VOTER)
        .findOneAndUpdate(
          { _id: new ObjectId(voterObjectId) },
          { $set: updateFields },
          { returnDocument: "after" }
        );

      if (!data)
        return res.status(404).json({
          message: "Voter not found",
        });

      return res.status(200).json({
        message: "Successfully updated",
        voter: {
          _id: data?._id,
          voterId: data?.voterId,
          constituencyId: data?.constituencyId,
          voterName: data?.voterName,
          dateOfBirth: data?.dateOfBirth,
          address: data?.address,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default voterRouter;
