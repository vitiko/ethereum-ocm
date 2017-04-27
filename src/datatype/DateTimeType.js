import IntegerType from './IntegerType';

export default class DateTimeType extends IntegerType {

  static convertFromRaw(value) {
    value = super.convertFromRaw(value);
    return value ? new Date(value * 1000) : null;
  }

  static convertToRaw(value) {

    if (typeof value == 'string') {
      let timestamp = Date.parse(value);
      if (isNaN(timestamp)) return [[`Invalid date format: ${value}`], value];
      else return [[], this.fromMilliseconds(value)];
    }

    if (value instanceof Date) return[[], this.fromMilliseconds(value.getTime())];

    //check integer
    return super.convertToRaw(value);
  }
}