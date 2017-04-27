import RawType from './RawType';


export default class AddressType extends RawType {


  static EMPTY_ADDRESS() {
    return '0x0000000000000000000000000000000000000000';
  }

  static convertToRaw(value) {
    let errors = [];


    //this constant wil be resolved later
    if (value == '%SIGNER_ADDRESS%')   return [errors, value];


    //null converts to 0x0000000000000000000000000000000000000000
    if (value === null)   return [errors, AddressType.EMPTY_ADDRESS()];


    return [errors, value];
  }


  static convertFromRaw(value) {
    if (value == AddressType.EMPTY_ADDRESS()) value = null;
    return value;

  }


  //todo: must be better way to get current addresses
  static converToRawExecTime(value, contract) {
    if (value == '%ENGINE_SIGNER%') value = contract.contract._eth.coinbase;
    //console.log (value);
    return value;
  }


}