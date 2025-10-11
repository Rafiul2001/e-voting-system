/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import { CandidateRecord } from "./record";
// import { KeyEndorsementPolicy } from 'fabric-shim';
import * as crypto from "crypto";

const electionCCName = "electioncc";
const votePermitCCName = "voterpermitcc";
const votingChannel = "votingchannel";

@Info({
  title: "Candidate Contract",
  description: "Candidate Smart Contract, implemented in TypeScript",
})
export class CandidateContract extends Contract {
  /**
   * Create Candidate
   */
  @Transaction()
  public async CreateCandidate(
    ctx: Context,
    candidateId: string,
    candidateName: string,
    voterId: string,
    electionId: string,
    constituencyNumber: number,
    constituencyName: string,
    affiliation: string,
    partyName: string | null
  ): Promise<string> {
    this._require(
      candidateId &&
        candidateName &&
        voterId &&
        electionId &&
        constituencyNumber &&
        constituencyName &&
        affiliation &&
        partyName,
      "candidateId, candidateName, voterId, electionId, constituencyNumber, constituencyName, affiliation and partyName are required"
    );

    try {
      const electionString = await ctx.stub.invokeChaincode(
        electionCCName,
        ["getElectionById", electionId],
        votingChannel
      );

      if (!electionString.payload) {
        return JSON.stringify({
          message: "Election not found",
          data: null,
        });
      }
      const election = JSON.parse(electionString.payload.toString());
      if (!(election.status === "initialized")) {
        return JSON.stringify({
          message:
            "Candidate can be added if the election state is initialized",
        });
      }

      const exists = await this.candidateExists(ctx, candidateId);
      if (exists) {
        return JSON.stringify({
          message: `This candidate is exists with voter id: ${candidateId}`,
          data: null,
        });
      }

      const txTime = ctx.stub.getTxTimestamp();
      const now = new Date(txTime.seconds.low * 1000).toISOString();

      const CandidateRecord: CandidateRecord = {
        candidateId,
        candidateName,
        voterId,
        electionId,
        constituency: [
          {
            constituencyNumber: constituencyNumber,
            constituencyName: constituencyName,
          },
        ],
        affiliationType: {
          affiliation: affiliation,
          partyName: partyName ?? null,
        },
        createdAt: now,
        updatedAt: "",
      };

      await ctx.stub.putState(
        CandidateRecord.candidateId,
        Buffer.from(JSON.stringify(CandidateRecord))
      );

      return JSON.stringify({
        message: "Candidate has been created",
        data: CandidateRecord,
      });
    } catch (error) {
      return `Internal server error: ${JSON.stringify(error)} | ${error}`;
    }
  }

  /**
   * Add Constituency
   * - Add the constituency to the existing candidate
   */

  @Transaction()
  public async addConstituency(
    ctx: Context,
    candidateId: string,
    electionId: string,
    constituencyNumber: number,
    constituencyName: string
  ): Promise<string> {
    this._require(
      candidateId && electionId && constituencyNumber && constituencyName,
      "candidateId, electionId, constituencyNumber, constituencyName are required"
    );

    try {
      const electionString = await ctx.stub.invokeChaincode(
        electionCCName,
        ["getElectionById", electionId],
        votingChannel
      );

      if (!electionString.payload) {
        return JSON.stringify({
          message: "Election not found",
          data: null,
        });
      }
      const election = JSON.parse(electionString.payload.toString());
      if (!(election.status === "initialized")) {
        return JSON.stringify({
          message:
            "Candidate can be updated if the election state is initialized",
        });
      }

      const candidateBytes = await ctx.stub.getState(candidateId);
      if (candidateBytes.length === 0) {
        return JSON.stringify({
          message: "Candidate is not found",
          data: null,
        });
      }

      const candidateRecord = JSON.parse(
        candidateBytes.toString()
      ) as CandidateRecord;

      if (candidateRecord.constituency.length === 5) {
        return JSON.stringify({
          message:
            "This candidate is already registered for maximum 5 constituencies.",
          data: null,
        });
      }

      if (
        candidateRecord.constituency.find(
          (can) => can.constituencyNumber === constituencyNumber
        )
      ) {
        return JSON.stringify({
          message: "This candidate is already registered for this constituency",
          data: null,
        });
      }

      candidateRecord.constituency.push({
        constituencyNumber,
        constituencyName,
      });

      candidateRecord.updatedAt = new Date().toISOString();

      await ctx.stub.putState(
        candidateId,
        Buffer.from(JSON.stringify(candidateRecord))
      );

      return JSON.stringify({
        message: "Constituency is added",
        data: candidateRecord,
      });
    } catch (error) {
      return `Internal server error: ${error}`;
    }
  }

  /**
   * Remove any constituency
   */
  @Transaction()
  public async RemoveConstituency(
    ctx: Context,
    candidateId: string,
    electionId: string,
    constituencyNumber: number,
    constituencyName: string
  ): Promise<string> {
    this._require(
      candidateId && electionId && constituencyNumber && constituencyName,
      "candidateId, electionId, constituencyNumber, constituencyName are required"
    );

    try {
      const electionString = await ctx.stub.invokeChaincode(
        electionCCName,
        ["getElectionById", electionId],
        votingChannel
      );

      if (!electionString.payload) {
        return JSON.stringify({
          message: "Election not found",
          data: null,
        });
      }
      const election = JSON.parse(electionString.payload.toString());
      if (!(election.status === "initialized")) {
        return JSON.stringify({
          message:
            "Candidate can be updated if the election state is initialized",
        });
      }

      const candidateBytes = await ctx.stub.getState(candidateId);
      if (candidateBytes.length === 0) {
        return JSON.stringify({
          message: "Candidate is not found",
          data: null,
        });
      }

      const candidateRecord = JSON.parse(
        candidateBytes.toString()
      ) as CandidateRecord;

      if (candidateRecord.constituency.length === 0) {
        return JSON.stringify({
          message:
            "Constituency can be delete. Instead of removing constituency delete the candidate.",
          data: null,
        });
      }

      if (
        !candidateRecord.constituency.find(
          (can) => can.constituencyNumber === constituencyNumber
        )
      ) {
        return JSON.stringify({
          message: "This constituency is not found",
          data: null,
        });
      }

      const updatedConstituencyList = candidateRecord.constituency.filter(
        (con) => con.constituencyNumber !== constituencyNumber
      );

      candidateRecord.constituency = updatedConstituencyList;

      candidateRecord.updatedAt = new Date().toISOString();

      await ctx.stub.putState(
        candidateId,
        Buffer.from(JSON.stringify(candidateRecord))
      );

      return JSON.stringify({
        message: "Constituency is removed",
        data: candidateRecord,
      });
    } catch (error) {
      return `Internal server error: ${error}`;
    }
  }

  // Utility guard
  private _require(cond: any, msg: string): void {
    if (!cond) throw new Error(msg);
  }

  /*
   * Get all the candidate based on electionId
   */
  @Transaction(false)
  public async getAllCandidatesByElectionId(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "Election Id is required");
    const candidateList: CandidateRecord[] = [];
    // Create a CouchDB rich query
    const queryString = {
      selector: {
        electionId: electionId,
      },
    };

    const iter = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    try {
      while (true) {
        const result = await iter.next();
        if (result.value && result.value.value) {
          const record = JSON.parse(
            result.value.value.toString()
          ) as CandidateRecord;
          candidateList.push(record);
        }

        if (result.done) {
          await iter.close();
          break;
        }
      }
    } finally {
      await iter.close(); // make sure it's always closed
    }
    return JSON.stringify({
      message: "Successfully get the list",
      data: candidateList,
    });
  }

  /*
   * Get all the candidate based on constituency name and number
   */
  @Transaction(false)
  public async getAllCandidatesByConstituencyNumber(
    ctx: Context,
    constituencyNumber: string,
    constituencyName: string
  ): Promise<string> {
    this._require(
      constituencyNumber && constituencyName,
      "Constituency number and constituency name is required"
    );
    const candidateList: CandidateRecord[] = [];
    // Correct CouchDB rich query using $elemMatch for array fields
    const queryString = {
      selector: {
        constituency: {
          $elemMatch: {
            constituencyNumber: constituencyNumber,
            constituencyName: constituencyName,
          },
        },
      },
    };

    const iter = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    try {
      while (true) {
        const result = await iter.next();
        if (result.value && result.value.value) {
          const record = JSON.parse(
            result.value.value.toString()
          ) as CandidateRecord;
          candidateList.push(record);
        }

        if (result.done) {
          await iter.close();
          break;
        }
      }
    } finally {
      await iter.close(); // make sure it's always closed
    }
    return JSON.stringify({
      message: "Successfully get the list",
      data: candidateList,
    });
  }

  @Transaction(false)
  public async candidateExists(
    ctx: Context,
    voterId: string
  ): Promise<boolean> {
    // Create a CouchDB rich query
    const queryString = {
      selector: {
        voterId: voterId,
      },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const result = await iterator.next();

    // If there’s at least one record found, it exists
    const exists = !result.done;

    await iterator.close();
    return exists;
  }
}
