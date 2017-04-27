export default class Property {


  constructor(name, contract, { get : getMethod }) {
    this.name = name;
    this.contract = contract;

    this.getMethod = getMethod;

    if (new.target === Property)
      throw new TypeError("Cannot construct Property instances directly");

    if (this.get === undefined)
      throw new TypeError('Property must implement "get"  method');
  }

  /**
   *
   * @returns {Promise}
   */
  toJSON() {
    return this.get();
  }
}



