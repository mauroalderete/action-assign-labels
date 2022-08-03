const validate = (token) => {
  if (!token) {
    throw new Error('github-token is not defined');
  }

  if (token.trim() === '') {
    throw new Error('github-token cann\'t be empty');
  }
};

const parse = (token) => {
  validate(token);
  return token;
};

module.exports = { validate, parse };
