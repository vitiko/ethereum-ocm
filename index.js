require("babel-core/register");
require("babel-polyfill");

const ContractManager = require('./lib/ContractManager');

module.exports = {


    create: function (options) {

        return new ContractManager(options);

    },


    ContractManager

}


