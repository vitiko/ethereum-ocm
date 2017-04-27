import fs from 'fs';
import path from 'path';
import Web3 from 'web3';

import Contract from './Contract';


class ContractManager {

  constructor({ paths, rpc }) {
    this.paths = paths;
    this.rpc = rpc;
  }


  contractExists(contractName) {
    return fs.existsSync(this.getSourcePath(this.normalizeName(contractName)));
  }

  //Contract name can be contract object ?
  contract(contractName) {
    contractName = this.normalizeName(contractName);
    let sourcePath = this.getSourcePath(contractName);

    if (!this.contractExists(contractName))
      throw new Error(`Contract source not found:  ${sourcePath}`);


    let dataPath = this.getDataPath(contractName);
    if (!fs.existsSync(dataPath))
      throw new Error(`Contract artifact not found:  ${dataPath}`);


    // console.log('Create contract', contractName, sourcePath, dataPath);

    return new Contract({ sourcePath, dataPath, provider: this.createWeb3Provider() });
  }


  createWeb3Provider() {
    if (!this.provider) this.provider = new Web3.providers.HttpProvider(`http://${this.rpc.host}:${this.rpc.port}`);
    return this.provider;
  }

  normalizeName(contractName) {
    if (!contractName.endsWith('.sol')) contractName += '.sol';
    return contractName;
  }

  getSourcePath(contractName) {
    return this.paths.contract.source + '/' + contractName;
  }

  getDataPath(contractName) {
    return this.paths.contract.build + '/' + path.basename(contractName).slice(0, -4) + '.json';
  }


  at(address) {

    let web3 = new Web3(this.createWeb3Provider());


    let contractCode = web3.eth.getCode(address);


    let creationTx = web3.eth.getTransaction  ('0x3180001a7756e6a1d303e0c54b465eece6706121e5ceb9669dd21fac97772aaa');

    console.log (creationTx);



    let local;

   // console.log (this.paths.contract.build);

    for (let dataFile of fs.readdirSync(this.paths.contract.build)) {

      let data = require (this.paths.contract.build+'/'+dataFile);

      //console.log  (data.contract_name, data.unlinked_binary);

      if (data.unlinked_binary == contractCode) console.log (data.contract_name);

       if (data.contract_name == 'IPObjectPhonogram') {


         local = data;



        // console.log (data.unlinked_binary.length.subst)
         //, ' -- ', data.unlinked_binary
       }
    }


    console.log ('\n\nContract deployed code length ', contractCode.length);
    console.log  ('\n\nTx:'+ creationTx.input.length);
    console.log  ('\n\nLocal:'+local.contract_name+' length ', local.unlinked_binary.length);


    console.log (creationTx.input.substr(0,local.unlinked_binary.length) == local.unlinked_binary );
  //, ' -- ', contractCode


  }
}


module.exports = ContractManager;