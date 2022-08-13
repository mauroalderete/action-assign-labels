const { makeInputConfigurator } = require('../actionInputs/inputConfigurator');
const { makeInputGetter } = require('../actionInputs/inputGetter');
const { makeInputsLoader } = require('./inputsLoader.app');
const { makeYAMLLoader } = require('./YAMLLoader.app');

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

  target.forEach((t) => {
    it(`${t.title} ${t.input}`, () => {
      const configurator = makeInputConfigurator();
      const getInputClientMock = makeInputGetter((name) => t.input[name], configurator);
      const yamlLoader = makeYAMLLoader();
      const inputsLoader = makeInputsLoader(getInputClientMock, yamlLoader);

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
