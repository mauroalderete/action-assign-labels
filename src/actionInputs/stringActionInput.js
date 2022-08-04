/* eslint-disable class-methods-use-this */
const ActionInput = require('./actionInput');

class StringActionInput extends ActionInput {
  #value;

  constructor(value) {
    super(value, { allowNull: false, allowUndefined: false });

    this.#validate(value);
    this.#value = this.#parse(value);
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    if (typeof value !== 'string') {
      throw new Error(`input ${value} is not a string data type`);
    }
  }

  #parse(value) {
    return value;
  }
}

module.exports = StringActionInput;
