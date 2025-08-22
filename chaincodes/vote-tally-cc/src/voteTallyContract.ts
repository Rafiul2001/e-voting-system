/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import { TallyRecord } from "./tallyRecord";
import * as crypto from "crypto";

const PREFIX = {
  TALLY: "TALLY", // TALLY#electionId#constituencyId#candidateId
};

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

@Info({
  title: "VoteTallyContract",
  description:
    "Vote Tally Smart Contract, using State Based Endorsement(SBE), implemented in TypeScript",
})
export class VoteTallyContract extends Contract {
  // Casting Vote
  @Transaction()
  public async CastVote(
    ctx: Context,
    electionId: string,
    constituencyId: string,
    candidateId: string,
    permit: string
  ): Promise<string> {
    this._require(
      electionId && constituencyId && candidateId && permit,
      "electionId, constituencyId, candidateId, and permit are required"
    );

    const permitHash = sha256Hex(permit);
    const ccAName = "voterpermitcc";
    const resp = await ctx.stub.invokeChaincode(
      ccAName,
      ["ValidateAndSpendPermit", electionId, permitHash],
      "mychannel"
    );

    if (resp.status !== 200) {
      throw new Error(
        `ValidateAndSpendPermit failed: status ${resp.status}, message: ${resp.message}`
      );
    }

    // Get the transaction timestamp (deterministic across peers)
    const txTimestamp = ctx.stub.getTxTimestamp();
    const updatedAt = new Date(txTimestamp.seconds.low * 1000).toISOString();

    const tallyKey = ctx.stub.createCompositeKey(PREFIX.TALLY, [
      electionId,
      constituencyId,
      candidateId,
    ]);
    const currentBytes = await ctx.stub.getState(tallyKey);

    let rec: TallyRecord;
    // const now = new Date().toISOString();

    if (!currentBytes || !currentBytes.length) {
      rec = {
        electionId,
        constituencyId,
        candidateId,
        voteCount: 1,
        updatedAt: updatedAt,
      };
    } else {
      rec = JSON.parse(currentBytes.toString()) as TallyRecord;
      rec.voteCount += 1;
      rec.updatedAt = updatedAt;
    }

    await ctx.stub.putState(tallyKey, Buffer.from(JSON.stringify(rec)));

    return JSON.stringify({ ok: true, tally: rec.voteCount });
  }

  // Get tally for a specific candidate in a constituency
  @Transaction(false)
  public async GetCandidateTally(
    ctx: Context,
    electionId: string,
    constituencyId: string,
    candidateId: string
  ): Promise<string> {
    this._require(
      electionId && constituencyId && candidateId,
      "missing inputs"
    );

    const key = ctx.stub.createCompositeKey(PREFIX.TALLY, [
      electionId,
      constituencyId,
      candidateId,
    ]);
    const bytes = await ctx.stub.getState(key);

    if (!bytes || !bytes.length) {
      return JSON.stringify({
        electionId,
        constituencyId,
        candidateId,
        voteCount: 0,
      });
    }
    return bytes.toString();
  }

  // Get all tallies for a constituency (returns an array)
  @Transaction()
  public async GetConstituencyTallies(
    ctx: Context,
    electionId: string,
    constituencyId: string
  ): Promise<string> {
    this._require(electionId && constituencyId, "missing inputs");

    const iter = await ctx.stub.getStateByPartialCompositeKey(PREFIX.TALLY, [
      electionId,
      constituencyId,
    ]);
    const results: TallyRecord[] = [];

    try {
      while (true) {
        const res = await iter.next();

        if (res.value && res.value.value) {
          const record = JSON.parse(res.value.value.toString()) as TallyRecord;
          results.push(record);
        }

        if (res.done) {
          await iter.close();
          break;
        }
      }
    } finally {
      await iter.close(); // make sure it's always closed
    }

    return JSON.stringify(results);
  }

  // Get all tallies for an election (across all constituency)
  @Transaction()
  public async GetElectionTallies(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "missing electionId");

    const iter = await ctx.stub.getStateByPartialCompositeKey(PREFIX.TALLY, [
      electionId,
    ]);
    const results: TallyRecord[] = [];
    try {
      while (true) {
        const res = await iter.next();

        if (res.value && res.value.value) {
          const record = JSON.parse(res.value.value.toString()) as TallyRecord;
          results.push(record);
        }

        if (res.done) {
          await iter.close();
          break;
        }
      }
    } finally {
      await iter.close(); // make sure it's always closed
    }

    return JSON.stringify(results);
  }

  private _require(cond: any, msg: string) {
    if (!cond) throw new Error(msg);
  }
}
