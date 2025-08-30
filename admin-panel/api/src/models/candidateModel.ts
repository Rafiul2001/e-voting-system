import { ObjectId } from "mongodb";
import { IElectionModel } from "./electionModel";
import { IConstituencyModel } from "./constituencyModel";
import { IVoterModel } from "./voterModel";

export const AFFILIATION_TYPE = {
  INDEPENDENT: "independent",
  DEPENDENT: "dependent",
} as const;

export interface ICandidateModel {
  _id?: ObjectId;
  candidateName: string;
  voterId: IVoterModel["_id"];
  electionId: IElectionModel["_id"];
  constituencyId: IConstituencyModel["_id"];
  affiliationType: (typeof AFFILIATION_TYPE)[keyof typeof AFFILIATION_TYPE];
  partyName?: string;
}

export class CandidateModel implements ICandidateModel {
  _id?: ObjectId;
  candidateName: string;
  voterId: IVoterModel["_id"];
  electionId: IElectionModel["_id"];
  constituencyId: IConstituencyModel["_id"];
  affiliationType: (typeof AFFILIATION_TYPE)[keyof typeof AFFILIATION_TYPE];
  partyName?: string;

  constructor(
    candidateName: string,
    voterId: IVoterModel["_id"],
    electionId: IElectionModel["_id"],
    constituencyId: IConstituencyModel["_id"],
    affiliationType: (typeof AFFILIATION_TYPE)[keyof typeof AFFILIATION_TYPE],
    partyName?: string,
    _id?: ObjectId
  ) {
    this._id = _id ? _id : new ObjectId();
    this.electionId = electionId;
    this.constituencyId = constituencyId;
    this.candidateName = candidateName;
    this.voterId = voterId;
    this.affiliationType = affiliationType;
    this.partyName = partyName;
  }
}
