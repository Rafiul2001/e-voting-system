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
  message: string;

  setDivisionList: () => void;
  setFilter: (filter: Partial<TFilter>) => void;
  addDivision: (divisionName: string) => void;
  updateConstituency: (constituencyObject: TConstituencyModel) => void;

  //   Computed parts
  getFilteredDivisionObject: () => TConstituencyModel | undefined;
};

export const useConstituencyStore = create<TConstituencyStore>((set, get) => ({
  message: "",
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

  addDivision: (divisionName) => {
    set((state) => {
      if (state.divisionList.some((d) => d.divisionName === divisionName)) {
        state.message = "This division is already exists";
        return state; // no duplicate
      }

      // TODO: Add the route of API

      state.message = "Division added successfully";
      return {
        divisionList: [...state.divisionList, { divisionName, districts: [] }],
      };
    });
  },

  updateConstituency: (constituencyObject) => {
    console.log(constituencyObject);
    set((state) => ({
      message: "Updated!",
      divisionList: state.divisionList.map((division) =>
        division.divisionName === constituencyObject.divisionName
          ? constituencyObject // create a new object
          : division
      ),
    }));
  },

  getFilteredDivisionObject: () => {
    const { divisionList, filter } = get();
    return divisionList.find(
      (division) =>
        division.divisionName.toLowerCase() ===
        filter.divisionName.toLowerCase()
    );
  },
}));
