interface IOperatorModel {
  _id?: string;
  operatorId: string;
  operatorPassword: string;
}

export class OperatorModel implements IOperatorModel {
  _id?: string;
  operatorId: string;
  operatorPassword: string;

  constructor(operatorId: string, operatorPassword: string, _id?: string) {
    this._id = _id;
    this.operatorId = operatorId;
    this.operatorPassword = operatorPassword;
  }
}
