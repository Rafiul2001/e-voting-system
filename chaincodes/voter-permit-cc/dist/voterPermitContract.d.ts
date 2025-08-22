import { Context, Contract } from 'fabric-contract-api';
export declare class VoterPermitContract extends Contract {
    /**
      * IssuePermit
      * - Client provides: electionId, voterHash (already hashed off-chain), permit (random string)
      * - Writes:
      *   - VOTER#electionId#voterHash -> { electionId, voterHash, issuedAt }
      *   - PERMIT#electionId#permitHash (status=issued)
      * - Throws if voter already has a permit for this election or permit already exists
      */
    IssuePermit(ctx: Context, electionId: string, voterHash: string, permit: string): Promise<string>;
    /**
   * HasVoted (aka has permit issued)
   * - Returns true if a permit has already been issued to this voter for this election.
   *   (You can treat "issued" as "has voted/used opportunity", since the permit can only be spent once.)
   */
    HasVoted(ctx: Context, electionId: string, voterHash: string): Promise<string>;
    /**
    * ValidateAndSpendPermit (INTERNAL - called by other chaincode)
    * - Input: electionId, permitHash
    * - Ensures the permit exists and is in 'issued' state, then marks it 'spent'.
    * - Returns "OK" on success.
    */
    ValidateAndSpendPermit(ctx: Context, electionId: string, permitHash: string): Promise<string>;
    private _require;
}
