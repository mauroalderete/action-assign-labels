/* eslint-disable class-methods-use-this */
class ActionInput {
  #value;

  #config;

  constructor(value, config) {
    this.#validate(value);

    this.#parseConfig(config);

    this.#value = this.#parse(value);
  }

  get value() {
    return this.#value;
  }

  #parseConfig(config) {
    this.#config = {
      allowUndefined: false,
      allowNull: false,
    };

    if (!config) {
      return;
    }

    if (config.allowUndefined !== undefined && config.allowUndefined !== null) {
      this.#config.allowUndefined = config.allowUndefined;
    }

    if (config.allowNull !== undefined && config.allowNull !== null) {
      this.#config.allowNull = config.allowNull;
    }
  }

  // eslint-disable-next-line no-unused-vars
  #validate(value) {
    if (value === undefined && !this.#config.allowUndefined) {
      throw new Error(`input value '${value}' can't be undefined`);
    }
    if (value === null && !this.#config.allowNull) {
      throw new Error(`input value '${value}' can't be null`);
    }
  }

  #parse(value) {
    return value;
  }
}

module.exports = ActionInput;
