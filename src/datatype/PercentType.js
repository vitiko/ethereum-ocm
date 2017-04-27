import DecimalType from './DecimalType';

export default class PercentType extends DecimalType {

  scale() {
    return 2;
  }
}