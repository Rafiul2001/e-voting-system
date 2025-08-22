export declare const PermitStatus: {
    readonly ISSUED: "issued";
    readonly SPENT: "spent";
};
export type TPermitStatus = typeof PermitStatus[keyof typeof PermitStatus];
export declare class VoterRecord {
    electionId: string;
    voterHash: string;
    issuedAt: string;
}
export declare class PermitRecord {
    electionId: string;
    permitHash: string;
    status: TPermitStatus;
    issuedAt: string;
    spentAt?: string;
}
