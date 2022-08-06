const AssignLabelsApp = require('./assignlabels.app');
const YAMLActionInput = require('../actionInputs/YAMLActionInput');
const { strategyOctokitSuccessfullMock } = require('../__mocks__/octokit.mock');

describe('ActionInput', () => {
  const conventionalCommits = new YAMLActionInput('./src/actionInputs/__mocks__/conventional-commits.yml');

  const app = new AssignLabelsApp(
    strategyOctokitSuccessfullMock,
    {
      owner: 'owner',
      repo: 'repo',
      number: 13,
    },
    {
      conventionalCommitsScheme: conventionalCommits.value,
      maintainLabelsNotFound: true,
      applyChanges: false,
    },
  );

  it('assign labels app', async () => {
    const expected = [
      ['bug', 'enhancement'],
      ['enhancement'],
      [],
    ];

    const [next, added, removed] = await app.exec();
    expect([next, added, removed]).toEqual([...expected]);
  });
});
