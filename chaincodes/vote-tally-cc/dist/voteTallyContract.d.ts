import { Context, Contract } from "fabric-contract-api";
export declare class VoteTallyContract extends Contract {
    CastVote(ctx: Context, electionId: string, constituencyId: string, candidateId: string, permit: string): Promise<string>;
    GetCandidateTally(ctx: Context, electionId: string, constituencyId: string, candidateId: string): Promise<string>;
    GetConstituencyTallies(ctx: Context, electionId: string, constituencyId: string): Promise<string>;
    GetElectionTallies(ctx: Context, electionId: string): Promise<string>;
    private _require;
}
