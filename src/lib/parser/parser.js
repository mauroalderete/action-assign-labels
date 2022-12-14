/**
 * Export a function that instances a new {@link Parser `Parser`} object
 * that allows us to validate and transform a value using chain operations.
 * @module src/lib/parser
 */

/**
 * Middleware that will be used by {@link Parser `Parser`} instance.
 * It should contain custom validations and custom transformers.
 *
 * You can use the setter value member in
 * {@link Parser `Parser`} instance to change the value of the parser
 * and pass it the next operation in the chain.
 * @callback parserMiddleware
 * @param {module:src/lib/parser~Parser} parser
 * A reference to Parser instances that will execute this middleware
 * @returns {void}
 */

/**
 * Parse receives a value that you want to validate or to apply a transform operation.
 * @class
 * @classdesc The parser allows validation and transforms the value received when is instanced.
 * All methods return a reference to self, to allow us to continue validating or transforming.
 *
 * Include a {@link Parser.use `use`} method to implement a customizable operation.
 * The last value is available from the value set method.
 *
 * In case of validation is not passed or a transform operation failed,
 * it will emit an expection.
 */
class Parser {
  #value;

  constructor(value) {
    this.#value = value;
  }

  /**
   * Current value of parser instance.
   * @type {any}
   */
  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }

  /**
   * Validates that value isn't undefined. Otherwise, it trigger an exception.
   * @returns {this} Self reference.
   */
  denyUndefined() {
    if (this.value === undefined) {
      throw new Error("the value mustn't be undefined");
    }

    return this;
  }

  /**
   * Validates that value isn't null. Otherwise, it trigger an exception.
   * @returns {this} Self reference.
   */
  denyNull() {
    if (this.value === null) {
      throw new Error("the value mustn't be null");
    }

    return this;
  }

  /**
   * Validates that string representation of the value isn't empty string.
   * Otherwise, it trigger an exception.
   * @returns {this} Self reference.
   */
  denyEmpty() {
    if (`${this.value}` === '') {
      throw new Error("the value mustn't be empty");
    }

    return this;
  }

  /**
   * Validates that the value is not undefined or null and
   * its 'string' representation is not empty either
   * Otherwise, it trigger an exception.
   * @returns {this} Self reference.
   */
  denyVoid() {
    this.denyUndefined().denyNull().denyEmpty();
    return this;
  }

  /**
   * Convert the value in a string.
   * @returns {this} Self reference.
   */
  toString() {
    this.value = `${this.value}`;
    return this;
  }

  /**
   * Try cast the value in a integer number.
   * Otherwise, it trigger an exception.
   * @returns {this} Self reference.
   */
  toInt() {
    const number = parseInt(this.value, 10);
    if (Number.isNaN(number)) {
      throw new Error(`input ${this.value} isn't a Int`);
    }
    this.value = number;

    return this;
  }

  /**
   * Try cast the value in a boolean. Otherwise, it trigger an exception.
   *
   * Use YAML 1.2 "Core Schema" specification to cast.
   *
   * Support boolean input list: \`true | True | TRUE | false | False | FALSE\`
   * @returns {this} Self refrence.
   */
  toBool() {
    const trueValue = ['true', 'True', 'TRUE', true];
    const falseValue = ['false', 'False', 'FALSE', false];

    if (trueValue.includes(this.value)) {
      this.value = true;
      return this;
    }

    if (falseValue.includes(this.value)) {
      this.value = false;
      return this;
    }

    throw new TypeError(
      `input ${this.value} does not meet YAML 1.2 "Core Schema" specification: Support boolean input list: \`true | True | TRUE | false | False | FALSE\``,
    );
  }

  /**
   * Mounts the specified middleware function.
   * The middleware function is executed passing the {@link Parser `Parser`}
   * self reference as parameter.
   *
   * You can use the middleware to manipulate the
   * [value]{@link module:src/lib/parser~Parser.value} member.
   * @param {parserMiddleware} action
   * @returns {this} Self refrence.
   */
  use(action) {
    if (!action) {
      return this;
    }

    try {
      action(this);
      // eslint-disable-next-line consistent-return
      return this;
    } catch (error) {
      throw new Error(`failed to invoke the middleware '${action.name}': ${error}`);
    }
  }
}

/**
 * Construct and return an instance of {@link Parser `Parser`}
 * ready to start to validate or transform the value setted.
 * @param {any} value Any object to validate or transform it
 * @returns {Parser}
 * An instance of {@link Parser `Parser`} with the value set.
 */
module.exports = (value) => new Parser(value);
