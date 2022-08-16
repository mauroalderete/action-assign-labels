/* eslint-disable no-unused-vars */
const { getTypesInCommits } = require('./conventional-commits');

const commitsListMock = [
  'fix: name folder mocks',
  'build: with pullrequest service',
  'feat: make service to handle pullrequest request with basic DI to inject any client, add unit test\nI don\'t make an interface to client, but i use the same api designed to octokit.',
  'feat: sketch to get commits',
  'not conventional commit',
  'feat: get pull request info using octokit request',
  'test: context from event path',
  'feat: get labels before update',
  'BREAKING CHANGE: get labels before update',
  'feat(fix): get labels before update',
];

const conventionalCommitsMock = {
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

describe('conventional-commits', () => {
  describe('validations', () => {
    it('commits is undefined', () => {
      expect(() => {
        getTypesInCommits(undefined, undefined);
      }).toThrow();
    });
    it('commits is null', () => {
      expect(() => {
        getTypesInCommits(null, undefined);
      }).toThrow();
    });
    it('commits is not string and not array', () => {
      expect(() => {
        getTypesInCommits(true, undefined);
      }).toThrow();
    });
    it('commits is string', () => {
      expect(() => {
        getTypesInCommits('some single commit', undefined);
      }).toThrow();
    });
    it('commits is array', () => {
      expect(() => {
        getTypesInCommits([], undefined);
      }).toThrow();
    });
    it('commits is string with some conventional commits scheme', () => {
      const types = getTypesInCommits('some single commit', conventionalCommitsMock);
      expect(types).toEqual([]);
    });
    it('commits is array with some conventional commits scheme', () => {
      const types = getTypesInCommits([], conventionalCommitsMock);
      expect(types).toEqual([]);
    });
  });

  describe('parse commits list', () => {
    it('get conventional-commits types from commits using conventional-commits scheme', () => {
      const expected = [
        { type: 'fix', nouns: ['fix', 'fixed'], labels: ['bug'] },
        { type: 'feature', nouns: ['feat', 'feature'], labels: ['enhancement'] },
        { type: 'breaking_change', nouns: ['BREAKING CHANGE'], labels: ['BREAKING CHANGE'] },
      ];

      expect(getTypesInCommits(commitsListMock, conventionalCommitsMock)).toEqual(expected);
    });
  });
});
