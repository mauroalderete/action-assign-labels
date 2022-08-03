const validate = (clearAllLabelsToStart) => {
  if (!clearAllLabelsToStart) {
    throw new Error('clear-all-labels-to-start is not defined');
  }

  if (clearAllLabelsToStart !== 'true' || clearAllLabelsToStart !== 'false') {
    throw new Error(`clear-all-labels-to-start '${clearAllLabelsToStart}' should be a bool value`);
  }
};

const parse = (clearAllLabelsToStart) => {
  validate(clearAllLabelsToStart);
  return clearAllLabelsToStart === 'true';
};

module.exports = { validate, parse };
