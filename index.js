require("babel-core/register");
require("babel-polyfill");

const Contract = require('./lib/Contract').default;
const ContractManager = require('./lib/ContractManager').default;

module.exports = {

  ContractManager,
  Contract

}


