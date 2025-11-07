interface IMachineModel {
  _id?: string;
  machineId: string;
  machinePassword: string;
}

export class MachineModel implements IMachineModel {
  _id?: string;
  machineId: string;
  machinePassword: string;

  constructor(machineId: string, machinePassword: string, _id?: string) {
    this._id = _id;
    this.machineId = machineId;
    this.machinePassword = machinePassword;
  }
}
