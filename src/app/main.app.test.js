const { mainApp } = require('./main.app');
const { makeYAMLLoader } = require('../lib/yaml-loader/yaml-loader');
const { makeInputLoader } = require('./input-loader.app');

const githubCoreMock = {
  getInput: (name) => {
    const inputs = {
      'pull-request-number': '100',
      'github-token': 'asd',
      'maintain-labels-not-matched': 'false',
      'apply-changes': 'true',
      'conventional-commits': `%YAML 1.2
      conventional-commits:
      - type: 'fix'
        nouns: ['fix', 'fixed']
        labels: ['bug']
      `,
    };
    return inputs[name];
  },
  getBooleanInput: (name) => {
    const inputs = {
      'pull-request-number': '100',
      'github-token': 'asd',
      'maintain-labels-not-matched': 'false',
      'apply-changes': 'true',
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

// eslint-disable-next-line no-unused-vars
const readerMock = (path, options) => {
  if (path !== 'conventional-commits.yml') {
    throw new Error('file not found');
  }

  return `%YAML 1.2
  conventional-commits:
  - type: 'fix'
    nouns: ['fix', 'fixed']
    labels: ['bug']
  `;
};

describe('Main App', () => {
  it('run', () => {
    const yamlLoaderClientMock = makeYAMLLoader(readerMock);
    const loadInputs = makeInputLoader(
      githubCoreMock.getInput,
      githubCoreMock.getBooleanInput,
      yamlLoaderClientMock,
    );

    const app = mainApp(githubCoreMock, loadInputs);

    expect(() => {
      app();
    }).not.toThrow();
  });
});
