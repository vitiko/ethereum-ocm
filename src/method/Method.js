import MethodCall from './MethodCall';


export default class Method {


  constructor({ structure, abi }) {

    this.structure = structure;
    this.abi = abi;

    this._inputNames = undefined;
    this._inputs = undefined;

    if (!abi && new.target === Method) throw new Error(`ABI for method ${structure.name} not defined`);

    this._prepareInputs();
  }


  createCall(args) {
    return new MethodCall(this, args);
  }


  _prepareInputs() {
    if (this._inputs != undefined) return;

    this._inputs = this.abi.inputs.map((input, pos) => {
      let param = this.structure.params[this.structure.paramsSeq[pos]];
      //console.log('-->', returns);
      input.typeHint = param.typeHint;
      input.pos = pos;
      
      return input;
    });

    this._inputNames = this.abi.inputs.map(input => input.name);
  }


  hasInput(inputName) {
    return this._inputNames.indexOf(inputName) != -1;
  }

  hasInputLike(inputName) {
    return this.getInputByNameLike(inputName) ? true : false;
  }

  getInputByNameLike(inputName) {

    if (this.hasInput(inputName)) return this.getInputByName(inputName);
    if (this.hasInput('_' + inputName)) return this.getInputByName('_' + inputName);

    return null;
  }

  getInputByName(inputName) {
    return this.hasInput(inputName) ? this._inputs[this._inputNames.indexOf(inputName)] : null;
  }

  get name() {
    return this.abi.name;
  }


  get constant() {
    return this.abi.constant;
  }


  get inputs() {
    return this._inputs;
  }

  get inputNames() {
    return this._inputNames;
  }


  get outputs() {

    return this.abi.outputs.map((output, pos) => {

      //console.log ('RETURNS', this.structure );

      let returns = this.structure.returns[this.structure.returnsSeq[pos]];
      //console.log('-->', returns);
      output.typeHint = returns.typeHint;
      return output;
    });
  }


  get isArrayAccess() {
    return this.abi.inputs.length == 1 && this.abi.inputs[0].type.substr(0, 4) == 'uint' && this.abi.inputs[0].name == '';

  }


}