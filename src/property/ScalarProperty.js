import Property from './Property';

export default class ScalarProperty extends Property {


  /**
   *
   * @returns {Promise}
   */
  get() {
    return this.contract.address ? this.contract[this.getMethod.name]() : Promise.resolve(null);
  }


  fromJSON(json) {
    throw new Error (`fromJSON for ScalarProperty ${this.name} not implemented`);
  }

}
