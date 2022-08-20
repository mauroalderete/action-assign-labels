/* eslint-disable no-unused-vars */
const fs = require('fs');
const core = require('@actions/core');
const pullRequestService = require('../services/pullrequest.service');

const app = require('./app');

jest.spyOn(core, 'setOutput').mockImplementation(() => {});

jest.spyOn(core.summary, 'write').mockImplementation(() => {});

jest.spyOn(core, 'setFailed').mockImplementation(() => {});

jest.spyOn(core, 'getInput').mockImplementation((value) => {
  const inputs = {
    'pull-request-number': '100',
    'github-token': 'asd',
    'conventional-commits': 'conventional-commits.yml',
  };
  return inputs[value];
});

jest.spyOn(core, 'getBooleanInput').mockImplementation((value) => {
  const inputs = {
    'maintain-labels-not-matched': false,
    'apply-changes': true,
  };
  return inputs[value];
});

jest.mock('../services/pullrequest.service', () => ({
  __esModule: true,
  makePullRequestService: (githubClient) => ({
    getPullRequest: async (owner, repository, pullRequestNumber) => ({
      labels: [
        {
          name: 'bug',
        },
      ],
    }),

    getCommits: async (owner, repository, pullRequestNumber) => [
      {
        commit: {
          message: 'feat: prepare env to test',
        },
      },
      {
        commit: {
          message: 'build: add gitignore to ignore tmp folder',
        },
      },
      {
        commit: {
          message: "Merge branch 'main' into 5-determine-the-labels-to-change-depending-on-the-conventional-commits-that-will-be-merged",
        },
      },
      {
        commit: {
          message: 'feat: get labels before update',
        },
      },
      {
        commit: {
          message: 'test: context from event path',
        },
      },
      {
        commit: {
          message: 'feat: get pull request info using octokit request',
        },
      },
      {
        commit: {
          message: 'feat: sketch to get commits',
        },
      },
      {
        commit: {
          message: 'feat: make service to handle pullrequest request with basic DI to inject any client, add unit test\n'
              + "I don't make an interface to client, but i use the same api designed to octokit.\n"
              + '\n'
              + 'In a future, we could consume some DI library',
        },
      },
      {
        commit: {
          message: 'build: with pullrequest service',
        },
      },
      {
        commit: {
          message: 'fix: name folder mocks',
        },
      },
    ],

    setLabels: async (owner, repository, pullRequestNumber, labels) => {},
  }),
}));

describe('main test', () => {
  beforeEach(() => {
    delete process.env.CI;
    delete process.env.GITHUB_TOKEN;
    delete process.env.INPUT_GITHUB_TOKEN;
    delete process.env.GITHUB_ACTION;
    delete process.env.GITHUB_API_URL;
    delete process.env.HTTPS_PROXY;
    delete process.env.https_proxy;
  });

  it('throw when github event path is nod defined', () => {
    expect(async () => {
      await app();
    }).rejects.toThrow();
  });

  it('throw when parse inputs', () => {
    process.env.GITHUB_ACTION = 'action';
    process.env.GITHUB_EVENT_PATH = 'event.json';
    jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
      if (path === process.env.GITHUB_EVENT_PATH) {
        return JSON.stringify({
          pull_request: {
            number: 100,
          },
          repository: {
            full_name: 'owner/repo',
          },
        });
      }
      if (path === 'conventional-commits.yml') {
        return `conventional-commits:
        - type: 'fix'
          nouns: ['fix', 'fixed']
          labels: ['bug']
        - type: 'feature'
          nouns: ['feat', 'feature']
          labels: ['enhancement']
        - type: 'breaking_change'
          nouns: ['BREAKING CHANGE']
          labels: ['BREAKING CHANGE']`;
      }
      return undefined;
    });

    process.env.GITHUB_EVENT_PATH = 'event.json';

    app().then(() => {
      expect(1).toBe(1);
    }).catch((error) => {
      expect(error).toBe(undefined);
    });
  });
});
