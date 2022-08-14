const { makeAssignerLabelsApp } = require('./assigner-labels.app');
const { makeYAMLLoader } = require('../lib/yaml-loader/yaml-loader');
const { makeInputLoader } = require('./input-loader.app');
const { changeLabels } = require('../lib/label-updater/label-updater');
const { getTypesInCommits } = require('../lib/conventional-commits/conventional-commits');
const { makePullRequestService } = require('../services/pullrequest.service');
const { strategyOctokitSuccessfullMock } = require('../__mocks__/octokit.mock');

const githubCoreMock = {
  getInput: (name) => {
    const inputs = {
      'pull-request-number': '100',
      'github-token': 'asd',
      'conventional-commits': 'conventional-commits.yml',
    };
    return inputs[name];
  },
  getBooleanInput: (name) => {
    const inputs = {
      'maintain-labels-not-matched': 'false',
      'apply-changes': 'true',
    };
    return inputs[name];
  },
};

// eslint-disable-next-line no-unused-vars
const readerAsyncMock = (path, options) => {
  if (path !== 'conventional-commits.yml') {
    throw new Error('file not found');
  }

  return `%YAML 1.2
  conventional-commits:
  - type: 'fix'
    nouns: ['fix', 'fixed']
    labels: ['bug']
  - type: 'feature'
    nouns: ['feat', 'feature']
    labels: ['enhancement']
  - type: 'breaking_change'
    nouns: ['BREAKING CHANGE']
    labels: ['BREAKING CHANGE']
  `;
};

const yamlLoaderClientMock = makeYAMLLoader(readerAsyncMock);

const loadInputsMock = makeInputLoader(
  githubCoreMock.getInput,
  githubCoreMock.getBooleanInput,
  yamlLoaderClientMock,
);

const service = makePullRequestService(strategyOctokitSuccessfullMock);

const contextMock = {
  repository: {
    full_name: 'owner/repo',
  },
  pull_request: {
    number: 100,
  },
};

describe('Assign Labels App', () => {
  it('run', async () => {
    const expected = [
      ['bug', 'enhancement'],
      ['enhancement'],
      [],
    ];

    const app = makeAssignerLabelsApp(
      loadInputsMock,
      changeLabels,
      getTypesInCommits,
      service,
    );

    expect(async () => {
      await app(contextMock);
    }).not.toThrow();

    const [next, added, removed] = await app(contextMock);
    expect([next, added, removed]).toEqual([...expected]);
  });
});
