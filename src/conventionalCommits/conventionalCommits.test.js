/* eslint-disable no-unused-vars */
const concom = require('./conventionalCommits');
const YAMLActionInput = require('../actionInputs/YAMLActionInput');

describe('ActionInput', () => {
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

  const cc = new YAMLActionInput('./src/actionInputs/__mocks__/conventional-commits.yml');

  it('get conventional-commits types from commits using conventional-commits scheme', () => {
    const expected = [
      { type: 'fix', nouns: ['fix', 'fixed'], labels: ['bug'] },
      { type: 'feature', nouns: ['feat', 'feature'], labels: ['enhancement'] },
    ];

    expect(concom.getTypesInCommits(commits, cc.value)).toEqual(expected);
  });

  // it('get conventional-commits types from commits without conventional-commits scheme', () => {
});
