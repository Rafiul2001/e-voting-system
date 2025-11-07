interface IMachineModel {
  _id?: string;
  machineId: string;
  machinePassword: string;
  isRevoked?: boolean;
}

export class MachineModel implements IMachineModel {
  _id?: string;
  machineId: string;
  machinePassword: string;
  isRevoked?: boolean;

  constructor(
    machineId: string,
    machinePassword: string,
    _id?: string,
    isRevoked?: boolean
  ) {
    this._id = _id;
    this.machineId = machineId;
    this.machinePassword = machinePassword;
    this.isRevoked = isRevoked !== undefined ? isRevoked : false;
  }
}
