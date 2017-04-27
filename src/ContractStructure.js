import SolidityStructure from 'solidity-structure';
import Method from './method/Method';
import ConstructorMethod from './method/ConstructorMethod';

export default  class ContractStructure {


  constructor({ truffleContract, sourceStructure, data, sourcePath, abi, abiHints }) {

    if (truffleContract) this._abi = truffleContract.abi;
    else this._abi = abi;

    this._abiHints = abiHints;


    if (sourceStructure) this._sourceStructure = sourceStructure;
    else if (data && data.sourceStructure) this._sourceStructure = data.sourceStructure;
    else if (sourcePath) this._sourceStructure = SolidityStructure.parseFile(sourcePath).toJSON();


    //another way - get structure from abi and abiHints if available
    //... later


    else
      throw new
        Error('Data not contain structure of solidity contract, therefore sourceStructure or sourcePath must provided to constructor');


    this._methods = {};
  }


  export() {

    return this._sourceStructure
  }



  //constructor params not exist in ABI
  getConstructor() {
    if (!this._sourceStructure.contract.constructor) return undefined;

    if (!this._methods['__constructor'])
      this._methods['__constructor'] = new ConstructorMethod({
        structure: this._sourceStructure.contract.constructor
      });

    return this._methods['__constructor'];
  }

  hasMethod(methodName) {
    return this._sourceStructure.functions[methodName] != undefined ||
      this._sourceStructure.constantFunctions[methodName] != undefined;
  }


  getConstantMethods() {
    return this._abi.filter(methodAbi => methodAbi.constant).map(methodAbi => this.getMethod(methodAbi.name));
  }

  getMethod(methodName) {
    if (!this.hasMethod(methodName)) return undefined;

    if (!this._methods[methodName])
      this._methods[methodName] = new Method({
        structure: this._sourceStructure.functions[methodName] || this._sourceStructure.constantFunctions[methodName],
        abi: this._abi.find(methodAbi => methodAbi.name == methodName)
      });

    return this._methods[methodName];
  }


}