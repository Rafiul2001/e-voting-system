import z from "zod";

// Read operations
export const getAllCandidateParams = z.object({
  electionId: z.string(),
});

export const getAllCandidateResponse = z.object({
  message: z.string(),
  candidateList: z.array(
    z.object({
      _id: z.string(),
      candidateName: z.string(),
      voterId: z.string(),
      electionId: z.string(),
      constituencyId: z.string(),
      affiliationType: z.string(),
      partyName: z.string().optional(),
    })
  ),
});

// Create operations
export const createCandidateBody = z.object({
  voterId: z.string(),
  electionId: z.string(),
  constituencyId: z.string(),
  voterName: z.string(),
  affiliationType: z.string(),
  partyName: z.string().optional(),
});

export const createCandidateResponse = z.object({
  message: z.string(),
  candidate: z.object({
    _id: z.string(),
    candidateName: z.string(),
    voterId: z.string(),
    constituencyId: z.string(),
    electionId: z.string(),
    affiliationType: z.string(),
    partyName: z.string().optional(),
  }),
});

// Delete operations
export const deleteCandidateParams = z.object({
  candidateId: z.string(),
});

export const deleteCandidateResponse = z.object({
  message: z.string(),
  candidate: z.object({
    _id: z.string(),
    candidateName: z.string(),
    voterId: z.string(),
    constituencyId: z.string(),
    electionId: z.string(),
    affiliationType: z.string(),
    partyName: z.string().optional(),
  }),
});

// Update Operations
export const updateCandidateParams = z.object({
  candidateId: z.string(),
});

export const updateCandidateBody = z.object({
  affiliationType: z.string().optional(),
  partyName: z.string().optional(),
});

export const updateCandidateResponse = z.object({
  message: z.string(),
  candidate: z.object({
    _id: z.string(),
    candidateName: z.string(),
    voterId: z.string(),
    constituencyId: z.string(),
    electionId: z.string(),
    affiliationType: z.string(),
    partyName: z.string().optional(),
  }),
});
