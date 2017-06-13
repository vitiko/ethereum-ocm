import RawType from './RawType';
import Web3 from 'web3';

const web3 = new Web3;


export default class HexAscii extends RawType {

  static convertFromRaw(value) {
    return web3.toAscii (value);
  }

  static convertToRaw(value) {
    let errors = [];
    return [errors, web3.fromAscii (String(value))];
  }

}