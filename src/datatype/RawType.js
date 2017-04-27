export default class RawType {


  /**
   * Converts FROM ethereum raw value
   * @param value
   * @returns {*}
   */
  static convertFromRaw(value) {
    return value;
  }

  /**
   * Validates and converts TO ethereum raw value
   * @param value
   * @returns {*}
   */
  static convertToRaw(value) {
    let errors = [];
    return [errors, value];
  }


  static validate(value) {
    return this.convertToRaw(value)[0];
  }

  /**
   * Common round function for all derived types
   */
  static roundNumber(value) {
    return Math.round(value);
  }


  /**
   * In ethereum datetimes storing in seconds
   * @param ms
   * @returns {*}
   */
  static fromMilliseconds(ms) {
    return this.roundNumber(ms / 1000);
  }

}
