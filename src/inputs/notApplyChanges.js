const validate = (notApplyChanges) => {
  if (!notApplyChanges) {
    throw new Error('not-apply-changes is not defined');
  }

  if (notApplyChanges !== 'true' || notApplyChanges !== 'false') {
    throw new Error(`not-apply-changes '${notApplyChanges}' should be a bool value`);
  }
};

const parse = (notApplyChanges) => {
  validate(notApplyChanges);
  return notApplyChanges === 'true';
};

module.exports = { validate, parse };
