const { makeInputsLoader } = require('./input-loader.app');

const mainApp = (githubCore, yamlLoaderClient) => () => {
  const loadInputs = makeInputsLoader(
    githubCore.getInput,
    githubCore.getBooleanInput,
    yamlLoaderClient,
  );
  loadInputs();
};

module.exports = { mainApp };
