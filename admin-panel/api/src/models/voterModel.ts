import { ObjectId } from "mongodb";
import { IConstituencyModel } from "./constituencyModel";

export interface IVoterModel {
  _id?: ObjectId;
  voterId: string;
  constituencyId: IConstituencyModel["_id"];
  voterName: string;
  dateOfBirth: string;
  address: string;
}

export class VoterModel implements IVoterModel {
  _id?: ObjectId;
  voterId: string;
  constituencyId: IConstituencyModel["_id"];
  voterName: string;
  dateOfBirth: string;
  address: string;

  constructor(
    voterId: string,
    constituencyId: IConstituencyModel["_id"],
    voterName: string,
    dateOfBirth: string,
    address: string,
    _id?: ObjectId
  ) {
    this._id = _id ? _id : new ObjectId();
    this.voterId = voterId;
    this.constituencyId = constituencyId;
    this.voterName = voterName;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
  }
}
