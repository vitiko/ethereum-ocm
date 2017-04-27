import Property from './Property';

export default class CollectionProperty extends Property {


  constructor(name, contract, { get, size : sizeMethod, add : addMethod, remove : removeMethod }) {
    super(name, contract, { get });
    this.sizeMethod = sizeMethod;
    this.addMethod = addMethod;
    this.removeMethod = removeMethod;
  }


  size() {
    return this.contract.address ? this.contract[this.sizeMethod.name]() : Promise.resolve(null);
  }


  add(...itemArgs) {
    return Promise.all(itemArgs.map(itemArg => {
      //console.log ('Call method ',this.addMethod, 'with args', itemArg);
      return this.contract[this.addMethod.name](itemArg);
    }));

  }

  get(pos = undefined) {
    if (!this.contract.address) return Promise.resolve(null);
    if (pos != undefined) return this.contract[this.getMethod.name](pos);
    return this
      .size()
      // array of promises, getting all positions for 0 to size
      .then(size => Promise.all(Array.from(Array(size).keys()).map(pos => this.get(pos))));
  }


  remove(pos) {
    if (!this.contract.address) throw new Error('Canr remove property item for contract without address');
    return this.contract[this.removeMethod.name](pos);
  }


  fromJSON(json) {
    let errors = [], methodCalls = [];

    if (!this.addMethod) errors.push(`Can't add value to property "${this.name}"`);
    else if (!Array.isArray(json)) errors.push(`Value of property "${this.name}" must be an array`);
    else {
      json.forEach(val => methodCalls.push(this.addMethod.createCall(val)));
    }

    return [errors, methodCalls];
  }
}