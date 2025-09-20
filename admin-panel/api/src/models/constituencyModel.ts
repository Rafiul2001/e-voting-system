import { ObjectId } from "mongodb";

type TUnion = {
  unionName: string;
  wards: number[];
};

type TUpazila = {
  upazilaName: string;
  unions: TUnion[];
};

type TCityCorporation = {
  cityCorporationName: string;
  wards: number[];
};

type TDistrict = {
  districtName: string;
  constituencyNumber: number;
  constituencyName: string;
  boundaries: {
    upazilas?: TUpazila[];
    cityCorporations?: TCityCorporation[];
  };
};

export interface IConstituencyModel {
  _id?: ObjectId;
  divisionName: string;
  districts: TDistrict[];
}

export class ConstituencyModel implements IConstituencyModel {
  _id?: ObjectId;
  divisionName: string;
  districts: TDistrict[];

  constructor(divisionName: string, districts: TDistrict[], _id?: ObjectId) {
    this._id = _id ? _id : new ObjectId();
    this.divisionName = divisionName.toLowerCase();
    this.districts = districts;
  }
}
