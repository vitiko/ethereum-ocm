import RawType from './RawType';

export default class IntegerType extends RawType {

  static convertFromRaw(value) {
    if (value.toNumber() != undefined) value = value.toNumber();
    return value;
  }


  static convertToRaw(value) {

    if (typeof value == 'string')
    {

        //value
    }

    return [[], value];
  }
}