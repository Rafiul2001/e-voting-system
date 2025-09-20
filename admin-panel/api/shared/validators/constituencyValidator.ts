import z from "zod";

const district = z.object({
  districtName: z.string(),
  constituencyNumber: z.number(),
  constituencyName: z.string(),
  boundaries: z.array(z.string()),
});

// Read Operations
export const getAllConstituenciesResponse = z.object({
  message: z.string(),
  constituencyList: z.array(
    z.object({
      _id: z.string(),
      divisionName: z.string(),
      districts: z.array(district),
    })
  ),
});

// Create new Constituency
export const createNewConstituencyBody = z.object({
  divisionName: z.string(),
  district: z.object({
    districtName: z.string(),
    constituencyNumber: z.string(),
    constituencyName: z.string(),
    boundaries: z.array(z.string()),
  }),
});

export const createNewConstituencyResponse = z.object({
  message: z.string(),
  newConstituency: z.object({
    divisionName: z.string(),
    district: z.object({
      districtName: z.string(),
      constituencyNumber: z.string(),
      constituencyName: z.string(),
      boundaries: z.array(z.string()),
    }),
  }),
});

// Delete an Constituency
export const deleteConstituencyParams = z.object({
  constituencyNumber: z.string(),
});

export const deleteConstituencyResponse = z.object({
  message: z.string(),
  deletedConstituency: z.object({
    divisionName: z.string(),
    district: z.object({
      districtName: z.string(),
      constituencyNumber: z.string(),
      constituencyName: z.string(),
      boundaries: z.array(z.string()),
    }),
  }),
});
