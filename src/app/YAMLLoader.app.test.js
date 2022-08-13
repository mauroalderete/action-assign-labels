/* eslint-disable no-unused-vars */
const { makeYAMLLoader } = require('./YAMLLoader.app');

describe('YAMLLoader.app', () => {
  const yaml = makeYAMLLoader();

  it('without input', () => {
    expect(() => {
      const input = yaml();
    }).toThrow();
  });

  const targets = [
    {
      title: 'null input', input: null,
    },
    {
      title: 'undefined input', input: undefined,
    },
    {
      title: 'empty string input', input: '',
    },
    {
      title: 'number input', input: 45,
    },
    {
      title: 'float input', input: 3.14,
    },
    {
      title: 'bool input', input: true,
    },
    {
      title: 'invalid yaml', input: '%YAML 1.2',
    },
    {
      title: 'valid yaml',
      input: `%YAML 1.2
      conventional-commits:
      - type: 'fix'
        nouns: ['fix', 'fixed']
        labels: ['bug']
      `,
      expected: {
        'conventional-commits': [
          {
            type: 'fix',
            nouns: ['fix', 'fixed'],
            labels: ['bug'],
          },
        ],
      },
    },
    {
      title: 'invalid yaml file', input: 'somefile.yml',
    },
    {
      title: 'valid yaml file',
      input: './src/actionInputs/__mocks__/conventional-commits.yml',
      expected: {
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
      },
    },
  ];

  targets.forEach((t) => {
    it(t.title, () => {
      if (t.expected) {
        const input = yaml(t.input);
        expect(input).toEqual(t.expected);
      } else {
        expect(() => {
          const input = yaml(null);
        }).toThrow();
      }
    });
  });
});
