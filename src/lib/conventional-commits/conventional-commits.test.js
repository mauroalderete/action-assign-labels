/* eslint-disable no-unused-vars */
const { getTypesInCommits } = require('./conventional-commits');

describe('conventional-commits', () => {
  const commits = [
    'fix: name folder mocks',
    'build: with pullrequest service',
    'feat: make service to handle pullrequest request with basic DI to inject any client, add unit test\nI don\'t make an interface to client, but i use the same api designed to octokit.',
    'feat: sketch to get commits',
    'not conventional commit',
    'feat: get pull request info using octokit request',
    'test: context from event path',
    'feat: get labels before update',
  ];

  const conventionalCommits = {
    'conventional-commits': [
      {
        type: 'fix',
        nouns: [
          'fix',
          'fixed',
        ],
        labels: [
          'bug',
        ],
      },
      {
        type: 'feature',
        nouns: [
          'feat',
          'feature',
        ],
        labels: [
          'enhancement',
        ],
      },
      {
        type: 'breaking_change',
        nouns: [
          'BREAKING CHANGE',
        ],
        labels: [
          'BREAKING CHANGE',
        ],
      },
    ],
  };

  it('get conventional-commits types from commits using conventional-commits scheme', () => {
    const expected = [
      { type: 'fix', nouns: ['fix', 'fixed'], labels: ['bug'] },
      { type: 'feature', nouns: ['feat', 'feature'], labels: ['enhancement'] },
    ];

    expect(getTypesInCommits(commits, conventionalCommits)).toEqual(expected);
  });
});
