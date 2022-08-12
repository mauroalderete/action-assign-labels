const makeInputGetter = (getInput, configurator) => (name, options) => {
  try {
    const value = getInput(name);

    if (options) {
      const config = configurator(value);
      options(config);
      return config.value;
    }

    return value;
  } catch (error) {
    throw new Error(`failed to get '${name}' input: ${error}`);
  }
};

module.exports = { makeInputGetter };
