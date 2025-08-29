import z from "zod";

// Get all voters depending on constituency Id
export const getAllVotersParams = z.object({
  constituencyId: z.string(),
});

export const getAllVotersResponse = z.object({
  message: z.string(),
  voterList: z.array(
    z.object({
      _id: z.string(),
      voterId: z.string(),
      constituencyId: z.string(),
      voterName: z.string(),
      dateOfBirth: z.string(),
      address: z.string(),
    })
  ),
});

// Create voter
export const createVoterBody = z.object({
  voterId: z.string(),
  constituencyId: z.string(),
  voterName: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
});

export const createVoterResponse = z.object({
  message: z.string(),
  voter: z.object({
    _id: z.string(),
    voterId: z.string(),
    constituencyId: z.string(),
    voterName: z.string(),
    dateOfBirth: z.string(),
    address: z.string(),
  }),
});

// Delete a voter
export const deleteVoterParams = z.object({
  voterObjectId: z.string(),
});

export const deleteVoterResponse = z.object({
  message: z.string(),
  voter: z.object({
    _id: z.string(),
    voterId: z.string(),
    constituencyId: z.string(),
    voterName: z.string(),
    dateOfBirth: z.string(),
    address: z.string(),
  }),
});

// Update a voter
export const updateVoterParams = z.object({
  voterObjectId: z.string(),
});

export const updateVoterBody = z.object({
  constituencyId: z.string(),
  voterName: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
});

export const updateVoterResponse = z.object({
  message: z.string(),
  voter: z.object({
    _id: z.string(),
    voterId: z.string(),
    constituencyId: z.string(),
    voterName: z.string(),
    dateOfBirth: z.string(),
    address: z.string(),
  }),
});
