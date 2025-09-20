import z from "zod";

const union = z.object({
  unionName: z.string(),
  wards: z.array(z.number()),
});

const upazila = z.object({
  upazilaName: z.string(),
  unions: z.array(union),
});

const cityCorporation = z.object({
  cityCorporationName: z.string(),
  wards: z.array(z.number()),
});

const constituency = z.object({
  constituencyNumber: z.number(),
  constituencyName: z.string(),
  boundaries: z.object({
    upazilas: z.array(upazila).optional(),
    cityCorporations: z.array(cityCorporation).optional(),
  }),
});

const district = z.object({
  districtName: z.string(),
  constituencies: z.array(constituency),
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

// Create new division
export const createNewDivisionBody = z.object({
  divisionName: z.string(),
});

export const createNewDivisionResponse = z.object({
  message: z.string(),
  constituency: z.object({
    divisionName: z.string(),
    districts: z.array(district),
  }),
});

// Add a part of constituency model
export const addConstituencyPartParams = z.object({
  constituencyObjectId: z.string(),
});

export const addConstituencyPartBody = z.object({
  districtName: z.string().optional(),
  constituency: z
    .object({
      constituencyNumber: z.number(),
      constituencyName: z.string(),
    })
    .optional(),
  cityCorporationName: z.string().optional(),
  cityCorporationWard: z.number().optional(),
  upazilaName: z.string().optional(),
  unionName: z.string().optional(),
  unionWard: z.number().optional(),
});

export const addConstituencyPartResponse = z.object({
  message: z.string(),
  constituency: z.object({
    divisionName: z.string(),
    districts: z.array(district),
  }),
});

// Update a part of Constituency model
export const updateConstituencyPartParams = z.object({
  constituencyObjectId: z.string(),
});

export const updateConstituencyPartBody = z.object({
  districtName: z.string().optional(),
  constituency: z
    .object({
      constituencyNumber: z.number(),
      constituencyName: z.string(),
    })
    .optional(),
  cityCorporationName: z.string().optional(),
  cityCorporationWard: z.number().optional(),
  upazilaName: z.string().optional(),
  unionName: z.string().optional(),
  unionWard: z.number().optional(),
});

export const updateConstituencyPartResponse = z.object({
  message: z.string(),
  constituency: z.object({
    divisionName: z.string(),
    districts: z.array(district),
  }),
});

// Delete a part of constituency model
export const deleteConstituencyPartParams = z.object({
  constituencyObjectId: z.string(),
});

export const deleteConstituencyPartBody = z.object({
  districtName: z.string().optional(),
  constituency: z
    .object({
      constituencyNumber: z.number(),
      constituencyName: z.string(),
    })
    .optional(),
  cityCorporationName: z.string().optional(),
  cityCorporationWard: z.number().optional(),
  upazilaName: z.string().optional(),
  unionName: z.string().optional(),
  unionWard: z.number().optional(),
});

export const deleteConstituencyPartResponse = z.object({
  message: z.string(),
  constituency: z.object({
    divisionName: z.string(),
    districts: z.array(district),
  }),
});

// Delete the whole Constituency with division
export const deleteConstituencyParams = z.object({
  constituencyObjectId: z.string(),
});

export const deleteConstituencyResponse = z.object({
  message: z.string(),
  constituency: z.object({
    divisionName: z.string(),
    districts: z.array(district),
  }),
});
