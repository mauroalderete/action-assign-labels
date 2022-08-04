/* eslint-disable class-methods-use-this */
class ActionInput {
  #value;

  #config;

  constructor(value, config) {
    this.#parseConfig(config);

    this.#validate(value);

    this.#value = this.#parse(value);
  }

  get value() {
    return this.#value;
  }

  get config() {
    return this.#config;
  }

  #parseConfig(config) {
    this.#config = {
      id: '',
      allowUndefined: false,
      allowNull: false,
    };

    if (!config) {
      return;
    }

    if (config.id) {
      this.#config.id = config.id;
    }

    if (config.allowUndefined) {
      this.#config.allowUndefined = config.allowUndefined;
    }

    if (config.allowNull) {
      this.#config.allowNull = config.allowNull;
    }
  }

  // eslint-disable-next-line no-unused-vars
  #validate(value) {
    if (value === undefined && !this.#config.allowUndefined) {
      throw new Error(`input ${this.#config.id} value '${value}' can't be undefined`);
    }
    if (value === null && !this.#config.allowNull) {
      throw new Error(`input ${this.#config.id} value '${value}' can't be null`);
    }
  }

  #parse(value) {
    return value;
  }
}

module.exports = ActionInput;
