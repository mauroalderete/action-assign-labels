const validate = (conventionalCommits) => {
  if (!conventionalCommits) {
    throw new Error('not-apply-changes is not defined');
  }
};

const parse = (conventionalCommits) => {
  validate(conventionalCommits);
  return conventionalCommits;
};

module.exports = { validate, parse };
