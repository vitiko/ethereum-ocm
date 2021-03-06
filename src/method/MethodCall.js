import  * as DataType from '../datatype';

const Web3 = require('web3');

export default class MethodCall {

  constructor(method, args) {
    this._method = method;

    //call options for method
    this._options = {};

    if (Array.isArray(args) && args.length > 0) {
      let lastItem = args[args.length - 1];

      //if last item is object and contain only fields from and/or gas
      if (typeof lastItem == 'object' && !Object.keys(lastItem).find(key => ['from', 'gas', 'password'].indexOf(key) == -1)) {
        this._options = args.pop();
      }
    }

    this._args = args;

    this._convertedArgs = undefined;
    this._errors = undefined;
    this._rawResult = undefined;

    this._web3 = new Web3();
  }


  get method() {
    return this._method;
  }

  get args() {
    this.convertArgs();
    return this._convertedArgs;
  }

  get errors() {
    this.convertArgs();
    return this._errors;
  }

  get rawArgs() {
    return this._args;
  }

  addKeyValueArg(key, value) {
    if (this._args == undefined) this._args = {};
    else if (Array.isArray(this._args)) throw new Error('Method arguments already set as array');

    this._args[key] = value;
  }

  /**
   * Execute method
   * @param truffleContract
   * @returns {*}
   */
  async execute(truffleContract) {

    const {password} = this._options;

    if (password) {
      delete this._options.password;
      this._web3.setProvider(truffleContract.constructor.web3.currentProvider);
      truffleContract.constructor.web3.eth.sendTransaction = (args, cb) => {
        return this._web3.personal.sendTransaction(args, password, cb);
      }
    }

    if (!truffleContract[this._method.name]) throw new Error('Truffle contract not initialized. Before call must use function new, deployed, at, fromJSON');
    this.convertArgs();
    if (this._errors.length) throw new TypeError(this._errors.join(';\n'));

    let args = this.convertExecTimeArgs(this._convertedArgs, truffleContract);
    this._rawResult = await truffleContract[this._method.name](...args, this._options);

    return this.getResult();
  }


  /**
   * Not good second time iterate
   * @param args
   * @param contract
   * @returns {*}
   */
  convertExecTimeArgs(args, contract) {
    let inputs = this._method.inputs;
    for (let inputPos in inputs) {
      let input = inputs[inputPos];
      args[inputPos] = DataType.execTimeReplaceConstants(input['type'], input['typeHint'], args[inputPos], contract);
    }

    return args;
  }

  /**
   * Convert from hashmap args to array
   * @param inputArgs
   */
  convertHashArgsIfNeeded(inputArgs) {
    if (!(inputArgs.length == 1 && typeof inputArgs[0] == 'object' && !Array.isArray(inputArgs[0]))) return [[], inputArgs];
    inputArgs = inputArgs[0]; //first element is hashmap

    let args = [], errors = [];

    for (let inputName of Object.keys(inputArgs)) {
      let input = this._method.getInputByNameLike(inputName);

      if (!input) errors.push(`Unknown input ${inputName} for method ${this._method.name}`);
      else args[input.pos] = inputArgs[inputName];
    }
    return [errors, args];
  }


  /**
   * Convert from javascript type to ethereum types
   * @returns {{errors: Array, args: Array}}
   */
  convertArgs() {
    if (this._convertedArgs != undefined) return [this._errors, this._convertedArgs];

    let args = [], errors = [];
    //args can be setted via addKeyValueArg
    let inputArgs = this._args && !Array.isArray(this._args) ? [this._args] : this._args;

    [errors, inputArgs] = this.convertHashArgsIfNeeded(inputArgs);

    let inputs = this._method.inputs;
    for (let inputPos in inputs) {

      let inputArg = inputArgs[inputPos];
      let input = inputs[inputPos];

      if (inputArg === undefined) {
        errors.push(`Argument #${inputPos} (${input.name}) for method ${this.method.name} undefined`);
        continue;
      }
      let [convertErrors, convertedValue] = DataType.convertToRaw(input['type'], input['typeHint'], inputArg);

      if (convertErrors.lentgh) errors.push(...convertErrors);
      else args[inputPos] = convertedValue;
    }

    this._convertedArgs = args;
    this._errors = errors;

    return [this._errors, this._convertedArgs];
  }


  getResult() {
    //transform only constant method returns
    if (this._method.constant) {
      return this.convertResult(this._rawResult);
    }
    else return this._rawResult;
  }


  convertResult(result, toHash = true) {
    let outputs = this._method.outputs;

    if (outputs.length == 1)
      return DataType.convertFromRaw(outputs[0]['type'], outputs[0]['typeHint'], result);

    else {

      result = result.map(
        (res, pos) => DataType.convertFromRaw(outputs[pos]['type'], outputs[pos]['typeHint'], res));
      if (toHash)
        result = result.reduce(
          (hash, value, pos) => Object.assign(hash, { [outputs[pos].name]: value }), {});
      return result;
    }

  }

  getRawResult() {
    return this._rawResult;
  }
}