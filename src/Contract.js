import createTruffleContract from 'truffle-contract';

//import Web3 from 'web3';

import ContractStructure from './ContractStructure';
import PropertyMapper from './property/PropertyMapper';
import MethodProxy from './method/MethodProxy';

export default class Contract {

  constructor({ truffleContract, data, address, dataPath, sourcePath, sourceStructure, provider, network_id, abi, abiHints, defaults }) {
    //decorate existing contract with address
    if (truffleContract) {
      this.contract = truffleContract;
    }
    else {
      //if we not have contract object we need data (abi, unlinked_binary etc for create it)
      if (!data) data = dataPath ? require(dataPath) : {};

      if (abi) data.abi = abi;
      if (address) data.address = address;
      if (network_id) data.network_id = network_id;

      if (!data.abi) throw new Errror('data{ abi, unlinked binary .. etc} or dataPath must be provided');

      //data.sourceStructure can already be in data or not
      this.contract = truffleContract = createTruffleContract(data);
    }

    this.structure = new ContractStructure({ truffleContract, sourceStructure, sourcePath, abiHints });
    this._methodProxy = new MethodProxy(this.contract, this.structure);
    this._propertyMapper = new PropertyMapper(this, this.structure);


    this.contract.abi.forEach(methodABI => {
      this[methodABI.name] = function methodProxy(...args) {
        return this._methodProxy.execute(methodABI.name, args);
      }
    });

    if (provider) this.contract.setProvider(provider);
    if (defaults) this.contract.defaults(defaults);
  }


  hasMethod(methodName) {
    return typeof(this[methodName]) == 'function' && this[methodName].name == 'methodProxy';
  }


  createFromTruffleContract(truffleContract) {


    
    //todo: export can be not sourceStructure !! (derived fro abi and abiHints )
    return new this.constructor ({ truffleContract: truffleContract, sourceStructure: this.structure.export() });
  }


  //todo: update contract instance
  update(...args) {
  }

  //todo: validate method call args
  validate() {

  }

  checkDefaults() {
    if (!this.contract.class_defaults.from) {
      this.contract.defaults({
        gas: 4200000,
        from: this.contract.web3.eth.coinbase
      });

      this.contract.setNetwork(this.contract.web3.version.network);
    }
  }


  /**
   *
   * @returns {*|Array}
   */
  properties() {
    return this._propertyMapper.all();
  }


  property(propertyName) {
    return this._propertyMapper.get(propertyName);
  }


  toJSON() {
    return this._propertyMapper.toJSON();
  }

  async fromJSON(json) {

    let errors, methodCalls, constructorArgs;

    //Sync code here
    try {
      if (typeof json == 'string') json = JSON.parse(json);

      [errors, methodCalls] = this._propertyMapper.fromJSONMethodCalls(json);
      if (errors.length) throw new Error(errors.join(';\n'));

      constructorArgs =
        methodCalls.length && methodCalls[0].method.name == 'constructor' ? methodCalls.shift().args : [];
    }
    catch (e) {
      return Promise.reject(e.message);
    }

    let contract = await this.new(...constructorArgs);

    //calls must be executed in same order
    for (let methodCall of methodCalls)
      //await contract[methodCall.method.name](...methodCall.args);
      await contract._methodProxy.executeMethodCall(methodCall);
    return contract;
  }


  //Proxying to underliing object
  new(...args) {
    this.checkDefaults();
    return this.contract.new(...args)
      .then(truffleContract => this.createFromTruffleContract(truffleContract));
  }

  at(...args) {
    this.checkDefaults();
    return this.contract.at(...args)
      .then(truffleContract => this.createFromTruffleContract(truffleContract));
  }

  deployed(...args) {
    this.checkDefaults();
    return this.contract.deployed(...args)
      .then(truffleContract => truffleContract ? this.createFromTruffleContract(truffleContract) : truffleContract);
  }


  isDeployed() {
    this.checkDefaults();

    /*
     this.contract.detectNetwork();

     this.contract.deployed().then ( a => console.log (a));*/

    return this.contract.isDeployed();
  }


  get address() {
    let address = undefined;
    try {
      address = this.contract.address;
    }
    catch (e) {
      address = undefined;
    }
    return address;
  }


  get status() {

    return {
      isDeployed: this.isDeployed(),
      address: this.address
    }
  }


}