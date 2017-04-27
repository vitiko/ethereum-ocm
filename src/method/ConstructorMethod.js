import Method from './Method';

//Constructor structure now rely only on information from solidity-structure
export default class ConstructorMethod extends Method {


  _prepareInputs() {
    if (this._inputs != undefined) return;

    this._inputs = this.structure.paramsSeq.map(paramName =>
      this.structure.params[paramName]
    ).map((input, pos) => {
      input.pos = pos;
      return input;
    });

    this._inputNames = this.structure.paramsSeq;
  }

  get name() {
    return 'constructor'
  }
}