/* eslint-disable class-methods-use-this */
const ActionInput = require('./actionInput');

class IntegerActionInput extends ActionInput {
  #value;

  #config;

  constructor(value, config) {
    super(value, config);

    this.#config = super.config;

    this.#validate(value);
    this.#value = this.#parse(value);
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    const number = parseInt(value, 10);
    if (Number.isNaN(number)) {
      throw new Error(`input ${this.#config.id} with value '${value}' is not a number type`);
    }
  }

  #parse(value) {
    return parseInt(value, 10);
  }
}

module.exports = IntegerActionInput;
