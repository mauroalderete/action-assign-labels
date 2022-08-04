/* eslint-disable class-methods-use-this */
const ActionInput = require('./actionInput');

class BoolActionInput extends ActionInput {
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
    if (value !== 'true' && value !== 'false') {
      throw new Error(`input '${value}' should be a bool value`);
    }
  }

  #parse(value) {
    return value === 'true';
  }
}

module.exports = BoolActionInput;
