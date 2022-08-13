const { makeInputConfigurator } = require('../actionInputs/inputConfigurator');
const { makeInputGetter } = require('../actionInputs/inputGetter');
const { makeInputsLoader } = require('./inputsLoader.app');

const mainApp = (githubCore, yamlLoaderClient) => () => {
  const inputConfigurator = makeInputConfigurator();

  const getInput = makeInputGetter(githubCore.getInput, inputConfigurator);
  const loadInputs = makeInputsLoader(getInput, yamlLoaderClient);
  loadInputs();
};

module.exports = { mainApp };
