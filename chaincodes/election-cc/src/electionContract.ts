/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Transaction } from "fabric-contract-api";
import { ElectionStatusRecord, PermitStatus, TPermitStatus } from "./record";
// import { KeyEndorsementPolicy } from 'fabric-shim';
import * as crypto from "crypto";

@Info({
  title: "Election Contract",
  description: "Election Smart Contract, implemented in TypeScript",
})
export class ElectionContract extends Contract {
  /**
   * Initialize the election poll
   * - Client provides: electionId
   */
  @Transaction()
  public async Initialize(ctx: Context, electionId: string): Promise<string> {
    this._require(electionId, "electionId is required");

    const electionBytes = await ctx.stub.getState(electionId);
    if (electionBytes && electionBytes.length) {
      throw new Error("Election is already initialized");
    }

    const now = new Date().toISOString();

    const electionRecord: ElectionStatusRecord = {
      electionId,
      status: PermitStatus.INITIALIZED,
      updatedAt: now,
    };

    await ctx.stub.putState(
      electionId,
      Buffer.from(JSON.stringify(electionRecord))
    );
    return "Election has been initialized";
  }

  /**
   * Start election
   * - Start the election calling this function
   */

  @Transaction()
  public async StartElection(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "electionId is required");

    const electionBytes = await ctx.stub.getState(electionId);
    if (!(electionBytes && electionBytes.length)) {
      throw new Error("Election is not found");
    }

    const electionRec = JSON.parse(
      electionBytes.toString()
    ) as ElectionStatusRecord;

    if (electionRec.status === PermitStatus.STARTED) {
      throw new Error("This election is already started");
    }

    electionRec.status = PermitStatus.STARTED;
    electionRec.updatedAt = new Date().toISOString();

    await this._checkAlreadyFinished(ctx, electionId);

    await ctx.stub.putState(
      electionId,
      Buffer.from(JSON.stringify(electionRec))
    );

    return "Election started!";
  }

  /**
   * Finish election
   * - Finish the election by calling this function
   */
  @Transaction()
  public async FinishElection(
    ctx: Context,
    electionId: string
  ): Promise<string> {
    this._require(electionId, "electionId is required");

    const electionBytes = await ctx.stub.getState(electionId);
    if (!(electionBytes && electionBytes.length)) {
      throw new Error("Election is not found");
    }

    const electionRec = JSON.parse(
      electionBytes.toString()
    ) as ElectionStatusRecord;

    if (electionRec.status === PermitStatus.FINISHED) {
      throw new Error("This election is already finished");
    }

    electionRec.status = PermitStatus.FINISHED;
    electionRec.updatedAt = new Date().toISOString();

    await ctx.stub.putState(
      electionId,
      Buffer.from(JSON.stringify(electionRec))
    );

    return "Election has finished";
  }

  // Utility guard
  private _require(cond: any, msg: string): void {
    if (!cond) throw new Error(msg);
  }

  private async _checkAlreadyFinished(ctx: Context, electionId: string) {
    const iterator = await ctx.stub.getHistoryForKey(electionId);
    try {
      while (true) {
        const res = await iterator.next();

        if (res.done) break;

        if (res.value && res.value.value.toString()) {
          const value = JSON.parse(res.value.value.toString()) as {
            electionId: string;
            status: TPermitStatus;
            updatedAt: string;
          };

          if (value.status === PermitStatus.FINISHED) {
            throw new Error(
              "This election is already finished before. Can't start again."
            );
          }
        }
      }
    } finally {
      await iterator.close();
    }
  }
}
