/* eslint-disable class-methods-use-this */
const ActionInput = require('./actionInput');

class StringActionInput extends ActionInput {
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
    if (typeof value !== 'string') {
      throw new Error(`input ${this.#config.id} with value '${value}' is not a string data type`);
    }
  }

  #parse(value) {
    return value;
  }
}

module.exports = StringActionInput;
