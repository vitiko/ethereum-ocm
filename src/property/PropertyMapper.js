import CollectionProperty from './CollectionProperty';
import ScalarProperty from './ScalarProperty';

/*
 _automatic_ property is:
 - public scalar storage variable (getter constant function )  http://solidity.readthedocs.io/en/develop/contracts.html#getter-functions
 - public array storage variable
 - public constant function without arguments and modifiers

 property is always one or more constant functions

 */
export default class PropertyMapper {

  constructor(contract, structure) {

    this._contract = contract;
    this._structure = structure;

    this._properties = {};
    this._propertyNames = null;
  }


  /**
   * Array of contract property names, now its all constant function without args ot array access functions
   * @returns {null|Array}
   */
  getPropertyNames() {

    if (Array.isArray(this._propertyNames)) return this._propertyNames;

    this._propertyNames = [];
    for (let method of  this._structure.getConstantMethods()) {
      // console.log (method);
      let propertyName = this.getPropertyForMethod(method);
      if (propertyName) this._propertyNames.push(propertyName);
    }

    return this._propertyNames;
  }


  getPropertyForMethod(method) {
    if (method.isArrayAccess) return method.name + 's';
    if (this.methodIsScalarProperty(method)) return method.name;
    return false;
  }

  methodIsScalarProperty(method) {
    return method.inputs.length == 0 && !method.name.endsWith('Size');
  }

  /**
   * Returns array of contract properties object
   * @returns {*|Array}
   */
  all() {

    //TODO: add caching
    return this.getPropertyNames().map(propertyName => this.get(propertyName));
  }


  has(propertyName, returnMethod = false) {

    if (this._properties[propertyName] != undefined) return true;

    let method = this._structure.getMethod(propertyName);
    if (method && this.methodIsScalarProperty(method)) return returnMethod ? method : true;

    if (propertyName.endsWith('s')) {
      let method = this._structure.getMethod(propertyName.slice(0, -1));
      if (method && method.isArrayAccess) return returnMethod ? method : true;
    }

    return false;
  }

  get(propertyName) {
    if (this._properties[propertyName]) return this._properties[propertyName];
    let method = this.has(propertyName, true);

    if (!method) throw new Error(`Property "${propertyName}" not defined`);

    this._properties[propertyName] = method.isArrayAccess ?
      new CollectionProperty(propertyName, this._contract, {
        get: method,
        size: this._structure.getMethod(method.name + 'Size'),
        add: this._structure.getMethod(method.name + 'Add')
      }) :
      new ScalarProperty(propertyName, this._contract, {
        get: method
      });

    return this._properties[propertyName];
  }

  /**
   * JSON representation of contract properties (Promise)
   * @returns {Promise}
   */
  toJSON() {

    let properties = this.all();

    //returns resolved toJSON for all properties
    return Promise.all(properties.map(property => property.toJSON()))
    //make json with key : value
      .then(propertyJsons =>
        properties.reduce((json, property, propertyPos) =>
            Object.assign(json, { [property.name]: propertyJsons[propertyPos] })
          , {}));
  }


  fromJSONMethodCalls(json) {
    let errors = [], methodCalls = [];
    let constructorMethod = this._structure.getConstructor();

    if (constructorMethod) {
      methodCalls.push(constructorMethod.createCall());
      //Search for constructor args
      Object.keys(json).filter(key => constructorMethod.hasInputLike(key)).forEach(key => {
        methodCalls[0].addKeyValueArg(key, json[key]);
        delete json[key];
      });
    }


    Object.keys(json).filter(key =>this.has(key)).forEach(key => {
      let [propErrors, propMethodCalls] = this.get(key).fromJSON(json[key]);
      errors.push(...propErrors);
      methodCalls.push(... propMethodCalls);
      delete json[key];
    });

    methodCalls.forEach(methodCall => {
      let [methodArgsErrors,args] = methodCall.convertArgs();
      if (methodArgsErrors) errors.push (...methodArgsErrors);
    });

    Object.keys(json).forEach(key => errors.push(`Can't find constructor argument or property for json attribute "${key}"`));
    return [errors, methodCalls];
  }
}