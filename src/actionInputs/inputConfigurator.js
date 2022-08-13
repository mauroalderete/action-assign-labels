const makeInputConfigurator = () => (value) => {
  function InputParser(val) {
    this.value = val;
  }

  InputParser.prototype = {

    denyUndefined() {
      if (this.value === undefined) {
        throw new Error("the value mustn't be undefined");
      }

      return this;
    },

    denyNull() {
      if (this.value === null) {
        throw new Error("the value mustn't be null");
      }

      return this;
    },

    denyEmpty() {
      if (`${this.value}` === '') {
        throw new Error("the value mustn't be empty");
      }

      return this;
    },

    denyVoid() {
      this.denyUndefined().denyNull().denyEmpty();
      return this;
    },

    toString() {
      this.value = `${this.value}`;
      return this;
    },

    toInt() {
      const number = parseInt(this.value, 10);
      if (Number.isNaN(number)) {
        throw new Error(`input ${this.value} isn't a Int`);
      }
      this.value = number;

      return this;
    },

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
    },

  };

  return new InputParser(value);
};

module.exports = { makeInputConfigurator };
