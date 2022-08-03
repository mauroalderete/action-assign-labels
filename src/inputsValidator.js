const pullRequestNumber = (number) => {
  if (!number) {
    throw new Error('pull-request-number is not defined');
  }

  const value = parseInt(number, 10);
  if (Number.isNaN(value)) {
    throw new Error(`pull-request-number '${number}' is not a number type`);
  }
};

const githubToken = (token) => {
  if (!token) {
    throw new Error('github-token is not defined');
  }

  if (token.trim() === '') {
    throw new Error('github-token cann\'t be empty');
  }
};

module.exports = { pullRequestNumber, githubToken };
