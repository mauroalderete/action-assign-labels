/* eslint-disable no-unused-vars */
const { getTypesInCommits } = require('./conventional-commits');
const { makeYAMLLoader } = require('../yaml-loader/yaml-loader');

const readerMock = (path, options) => {
  if (path !== 'conventional-commits.yml') {
    throw new Error('file not found');
  }

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
};

const yamlLoader = makeYAMLLoader(readerMock);

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

  const ccScheme = yamlLoader('conventional-commits.yml');

  it('get conventional-commits types from commits using conventional-commits scheme', () => {
    const expected = [
      { type: 'fix', nouns: ['fix', 'fixed'], labels: ['bug'] },
      { type: 'feature', nouns: ['feat', 'feature'], labels: ['enhancement'] },
    ];

    expect(getTypesInCommits(commits, ccScheme)).toEqual(expected);
  });
});
