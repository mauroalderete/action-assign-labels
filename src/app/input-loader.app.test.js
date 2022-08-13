const { makeInputConfigurator } = require('../actionInputs/inputConfigurator');
const { makeInputGetter } = require('../actionInputs/inputGetter');
const { makeYAMLLoader } = require('./YAMLLoader.app');
const { makeInputsLoader } = require('./input-loader.app');

describe('inputsLoader.app', () => {
  const target = [
    {
      title: 'numberInput',
      input: {},
      expectedThrow: true,
    },
    {
      title: 'numberInput',
      input: {
        'pull-request-number': '100',
      },
      expectedThrow: true,
    },
    {
      title: 'numberInput',
      input: {
        'pull-request-number': '100',
        'github-token': 'asd',
      },
      expectedThrow: true,
    },
    {
      title: 'numberInput',
      input: {
        'pull-request-number': '100',
        'github-token': 'asd',
        'maintain-labels-not-matched': false,
      },
      expectedThrow: true,
    },
    {
      title: 'numberInput',
      input: {
        'pull-request-number': '0',
        'github-token': 'asd',
        'maintain-labels-not-matched': false,
        'apply-changes': true,
        'conventional-commits': `%YAML 1.2
        conventional-commits:
        - type: 'fix'
          nouns: ['fix', 'fixed']
          labels: ['bug']
        `,
      },
      expectedThrow: true,
    },
    {
      title: 'numberInput',
      input: {
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
      },
      expectedValue: {
        pullRequestNumber: 100,
        githubToken: 'asd',
        maintainLabelsNotFound: false,
        applyChanges: true,
        conventionalCommits: {
          'conventional-commits': [
            {
              type: 'fix',
              nouns: ['fix', 'fixed'],
              labels: ['bug'],
            },
          ],
        },
      },
    },
  ];

  // eslint-disable-next-line no-unused-vars
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
  const yamlLoaderMock = makeYAMLLoader(readerMock);

  target.forEach((t) => {
    it(`${t.title} ${t.input}`, () => {
      const stringInputClientMock = (name) => t.input[name];
      const booleanInputClientMock = (name) => t.input[name];
      const inputsLoader = makeInputsLoader(
        stringInputClientMock,
        booleanInputClientMock,
        yamlLoaderMock,
      );

      if (t.expectedThrow) {
        expect(() => {
          inputsLoader(t.input);
        }).toThrow();
      } else {
        expect(() => {
          inputsLoader(t.input);
        }).not.toThrow();

        const value = inputsLoader(t.input);
        expect(value).toEqual(t.expectedValue);
      }
    });
  });
});
