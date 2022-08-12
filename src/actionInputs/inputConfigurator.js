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
    },

  };

  return new InputParser(value);
};

module.exports = { makeInputConfigurator };
