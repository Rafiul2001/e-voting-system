import z from "zod";

// Read Operations
export const getAllConstituenciesResponse = z.object({
  message: z.string(),
  constituencyList: z.array(
    z.object({
      _id: z.string(),
      constituencyName: z.string(),
    })
  ),
});

// Create new Constituency
export const createNewConstituencyBody = z.object({
  constituencyName: z.string(),
});

export const createNewConstituencyResponse = z.object({
  message: z.string(),
  constituency: z.object({
    _id: z.string(),
    constituencyName: z.string(),
  }),
});

// Delete an Constituency
export const deleteConstituencyParams = z.object({
  constituencyId: z.string(),
});

export const deleteConstituencyResponse = z.object({
  message: z.string(),
  constituency: z.object({
    _id: z.string(),
    constituencyName: z.string(),
  }),
});
