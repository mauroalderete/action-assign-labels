const makeContexter = (readerAsync) => (path) => {
  const context = readerAsync(path, { encoding: 'utf8' });
  if (!context) {
    throw new Error('failed to load context');
  }

  return JSON.parse(context);
};

module.exports = { makeContexter };
