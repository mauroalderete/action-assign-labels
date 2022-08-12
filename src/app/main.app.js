const { makeInputConfigurator } = require('../actionInputs/inputConfigurator');
const { makeInputGetter } = require('../actionInputs/inputGetter');
const { makeInputsLoader } = require('./inputsLoader.app');

const mainApp = (githubCore) => () => {
  const inputConfigurator = makeInputConfigurator();
  console.log('init configurator', inputConfigurator);
  const getInput = makeInputGetter(githubCore.getInput, inputConfigurator);
  console.log('init getInput', getInput);
  const loadInputs = makeInputsLoader(getInput);
  console.log('init loadInputs', loadInputs);

  const inputs = loadInputs();
  console.log('inputs loaded: ', inputs);
};

module.exports = { mainApp };
