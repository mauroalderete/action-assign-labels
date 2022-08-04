/* eslint-disable class-methods-use-this */
const ActionInput = require('./actionInput');

class BoolActionInput extends ActionInput {
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
    if (value !== 'true' && value !== 'false') {
      throw new Error(`input ${super.config.id} '${value}' should be a bool value`);
    }
  }

  #parse(value) {
    return value === 'true';
  }
}

module.exports = BoolActionInput;
