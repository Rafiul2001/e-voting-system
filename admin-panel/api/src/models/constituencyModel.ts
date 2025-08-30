import { ObjectId } from "mongodb";

export interface IConstituencyModel {
  _id?: ObjectId;
  constituencyName: string;
}

export class ConstituencyModel implements IConstituencyModel {
  _id?: ObjectId;
  constituencyName: string;

  constructor(constituencyName: string, _id?: ObjectId) {
    this._id = _id ? _id : new ObjectId();
    this.constituencyName = constituencyName.toLowerCase();
  }
}
