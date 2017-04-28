import DecimalType from './DecimalType';

export default class MoneyType extends DecimalType {

  scale() {
    return 2;
  }
}