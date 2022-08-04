/* eslint-disable no-unused-vars */
const YAMLActionInput = require('./YAMLActionInput');

describe('YAMLActionInput', () => {
  it('without input', () => {
    expect(() => {
      const input = new YAMLActionInput();
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
      input: './.github/conventional-commits.test.yml',
      expected: {
        'conventional-commits': [
          {
            fix: {
              commit: [
                'fix',
                'fixed',
                'FIX',
                'FIXED',
              ],
              labels: [
                'bug',
              ],
            },
          },
          {
            feature: {
              commit: [
                'feat',
                'feature',
                'FEAT',
                'FEATURE',
              ],
              labels: [
                'enhacement',
              ],
            },
          },
          {
            breaking_change: {
              commit: [
                'BREAKING CHANGE',
              ],
              labels: [
                'BREAKING CHANGE',
              ],
            },
          },
        ],
      },
    },
  ];
  targets.forEach((t) => {
    it(t.title, () => {
      if (t.expected) {
        const input = new YAMLActionInput(t.input);
        expect(input.value).toEqual(t.expected);
      } else {
        expect(() => {
          const input = new YAMLActionInput(null);
        }).toThrow();
      }
    });
  });
});
