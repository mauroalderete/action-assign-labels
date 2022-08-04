/* eslint-disable class-methods-use-this */
const ActionInput = require('./actionInput');

class IntegerActionInput extends ActionInput {
  #value;

  constructor(value) {
    super(value, { allowUndefined: false, allowNull: false });

    this.#validate(value);
    this.#value = this.#parse(value);
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    const number = parseInt(value, 10);
    if (Number.isNaN(number)) {
      throw new Error(`input '${value}' is not a number type`);
    }
  }

  #parse(value) {
    return parseInt(value, 10);
  }
}

module.exports = IntegerActionInput;
