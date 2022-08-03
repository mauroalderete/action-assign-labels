const validate = (removeLabelsNotFound) => {
  if (!removeLabelsNotFound) {
    throw new Error('remove-labels-not-found is not defined');
  }

  if (removeLabelsNotFound !== 'true' || removeLabelsNotFound !== 'false') {
    throw new Error(`remove-labels-not-found '${removeLabelsNotFound}' should be a bool value`);
  }
};

const parse = (removeLabelsNotFound) => {
  validate(removeLabelsNotFound);
  return removeLabelsNotFound === 'true';
};

module.exports = { validate, parse };
