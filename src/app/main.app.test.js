const { mainApp } = require('./main.app');
const { makeYAMLLoader } = require('./YAMLLoader.app');

const coreMock = {
  getInput: (name) => {
    const inputs = {
      'pull-request-number': '100',
      'github-token': 'asd',
      'maintain-labels-not-matched': false,
      'apply-changes': true,
      'conventional-commits': `%YAML 1.2
      conventional-commits:
      - type: 'fix'
        nouns: ['fix', 'fixed']
        labels: ['bug']
      `,
    };
    return inputs[name];
  },
};

describe('Main App', () => {
  it('run', () => {
    const yamlLoaderClient = makeYAMLLoader();
    const app = mainApp(coreMock, yamlLoaderClient);
    console.log('run app');
    app();
    expect(1).toBe(1);
  });
});
