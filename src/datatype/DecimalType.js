import RawType from './RawType';

export default class DecimalType extends RawType {


  static scale () {
    return 2;
  }

  static convertFromRaw(value) {
    if (value.toNumber() != undefined) value = value.toNumber();
    return value/ Math.pow (10,this.scale());
  }


  static convertToRaw(value) {


    //console.log ('Decimal to raw: ', value);
    if (typeof value == 'string')
    {

      //value
    }

    value*= Math.pow (10,this.scale());

    return [[], value];
  }
}