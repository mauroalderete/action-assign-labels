const { makeYAMLLoader } = require('../lib/yaml-loader/yaml-loader');
const { makeInputLoader } = require('./input-loader.app');

describe('inputLoader.app', () => {
  const target = [
    {
      title: 'object empty',
      input: {},
      expectedThrow: true,
    },
    {
      title: 'pr',
      input: {
        'pull-request-number': '100',
      },
      expectedThrow: true,
    },
    {
      title: 'pr negative',
      input: {
        'pull-request-number': '-100',
      },
      expectedThrow: true,
    },
    {
      title: 'pr+token',
      input: {
        'pull-request-number': '100',
        'github-token': 'asd',
      },
      expectedThrow: true,
    },
    {
      title: 'pr+token+maintain',
      input: {
        'pull-request-number': '100',
        'github-token': 'asd',
        'maintain-labels-not-matched': false,
      },
      expectedThrow: true,
    },
    {
      title: 'pr+token+maintain+apply',
      input: {
        'pull-request-number': '100',
        'github-token': 'asd',
        'maintain-labels-not-matched': false,
        'apply-changes': true,
      },
      expectedThrow: true,
    },
    {
      title: 'all ok',
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
    {
      title: 'all ok from file',
      input: {
        'pull-request-number': '100',
        'github-token': 'asd',
        'maintain-labels-not-matched': false,
        'apply-changes': true,
        'conventional-commits': 'conventional-commits.yml',
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

    return `%YAML 1.2
    conventional-commits:
    - type: 'fix'
      nouns: ['fix', 'fixed']
      labels: ['bug']
    `;
  };
  const yamlLoaderMock = makeYAMLLoader(readerMock);

  target.forEach((t) => {
    it(`${t.title}`, () => {
      const stringInputClientMock = (name) => t.input[name];
      const booleanInputClientMock = (name) => t.input[name];
      const inputLoader = makeInputLoader(
        stringInputClientMock,
        booleanInputClientMock,
        yamlLoaderMock,
      );

      if (t.expectedThrow) {
        expect(() => {
          inputLoader(t.input);
        }).toThrow();
      } else {
        expect(() => {
          inputLoader(t.input);
        }).not.toThrow();

        const value = inputLoader(t.input);
        expect(value).toEqual(t.expectedValue);
        expect(typeof value.pullRequestNumber).toBe('number');
        expect(typeof value.githubToken).toBe('string');
        expect(typeof value.maintainLabelsNotFound).toBe('boolean');
        expect(typeof value.applyChanges).toBe('boolean');
        expect(typeof value.conventionalCommits).toBe('object');
        expect(Array.isArray(value.conventionalCommits['conventional-commits'])).toBe(true);
      }
    });
  });
});
