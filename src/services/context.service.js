const makeContexter = (readerSync) => (path) => {
  try {
    const context = readerSync(path, { encoding: 'utf8' });
    return JSON.parse(context);
  } catch (error) {
    throw new Error(`failed to load context: ${error}`);
  }
};

module.exports = { makeContexter };
