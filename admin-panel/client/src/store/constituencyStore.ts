import { create } from "zustand";
import type { TConstituencyModel } from "../types/ConstituencyType";
import { constituencyListSampleData } from "../testingData/constituencyDataSample";

type TFilter = {
  divisionName: string;
  districtName: string;
  pageNumber: number;
};

type TConstituencyStore = {
  divisionList: TConstituencyModel[];
  filter: TFilter;

  setDivisionList: () => void;
  setFilter: (filter: Partial<TFilter>) => void;
};

export const useConstituencyStore = create<TConstituencyStore>((set) => ({
  divisionList: [],
  filter: {
    divisionName: "",
    districtName: "",
    pageNumber: 1,
  },

  setDivisionList: () => set({ divisionList: constituencyListSampleData }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),
}));
