import MethodCall from './MethodCall';

export default class MethodProxy {

  constructor(truffleContract, structure) {
    this._truffleContract = truffleContract;
    this._structure = structure;
  }

  setContract (truffleContract) {
    this._truffleContract = truffleContract;
  }

  /**
   * Execute method of truffle contract
   * @param methodName
   * @param args
   * @returns {Promise}
   */
  execute(methodName, args) {
    //console.log ('method proxy', methodName, args);
    return this.executeMethodCall(this.createMethodCall(methodName, args));
  }

  executeMethodCall(methodCall) {
    return methodCall.execute(this._truffleContract);
  }

  createMethodCall(methodName, args) {
    if (!this._structure.hasMethod(methodName))
      throw new Error(`Method "${ methodName }" is not defined in contract ${ this._truffleContract.contract_name }`);

    return new MethodCall(this._structure.getMethod(methodName), args);
  }
}