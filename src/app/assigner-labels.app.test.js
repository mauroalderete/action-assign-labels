const { makeAssignerLabelsApp } = require('./assigner-labels.app');
const { makeYAMLLoader } = require('../lib/yaml-loader/yaml-loader');
const { makeInputLoader } = require('./input-loader.app');
const { changeLabels } = require('../lib/label-updater/label-updater');
const { getTypesInCommits } = require('../lib/conventional-commits/conventional-commits');
const { makePullRequestService } = require('../services/pullrequest.service');
const {
  strategyOctokitSuccessfullMock,
  octokitPullrequestSuccessfullMock,
  octokitSetLabelsSuccessfullMock,
  octokitCommitsSuccessfullNotConventionalCommitsMock,
} = require('../__mocks__/octokit.mock');

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

const contextMock = {
  repository: {
    full_name: 'owner/repo',
  },
  pull_request: {
    number: 100,
  },
};

function GithubClientMock() {
  this.request = strategyOctokitSuccessfullMock.request;
}

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
      GithubClientMock,
      makePullRequestService,
    );

    expect(async () => {
      await app(contextMock);
    }).not.toThrow();

    const [next, added, removed] = await app(contextMock);
    expect([next, added, removed]).toEqual([...expected]);
  });
});

describe('Assign Labels App without conventional commits matched', () => {
  it('run', async () => {
    const expected = [
      [],
      [],
      ['bug'],
    ];

    function GithubClientMock2() {
      this.request = (url) => {
        switch (url) {
          case 'GET /repos/{owner}/{repository}/pulls/{pullRequestNumber}':
            return octokitPullrequestSuccessfullMock.request();
          case 'GET /repos/{owner}/{repository}/pulls/{pullRequestNumber}/commits':
            return octokitCommitsSuccessfullNotConventionalCommitsMock.request();
          case 'PUT /repos/{owner}/{repository}/issues/{pullRequestNumber}/labels':
            return octokitSetLabelsSuccessfullMock.request();
          default:
            return octokitPullrequestSuccessfullMock.request();
        }
      };
    }

    const app = makeAssignerLabelsApp(
      loadInputsMock,
      changeLabels,
      getTypesInCommits,
      GithubClientMock2,
      makePullRequestService,
    );

    expect(async () => {
      await app(contextMock);
    }).not.toThrow();

    const [next, added, removed] = await app(contextMock);
    expect([next, added, removed]).toEqual([...expected]);
  });
});
