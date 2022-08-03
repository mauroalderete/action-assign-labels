const validate = (number) => {
  if (!number) {
    throw new Error('pull-request-number is not defined');
  }

  const value = parseInt(number, 10);
  if (Number.isNaN(value)) {
    throw new Error(`pull-request-number '${number}' is not a number type`);
  }
};

const parse = (number) => {
  validate(number);
  return parseInt(number, 10);
};

module.exports = { validate, parse };
