const { makeYAMLLoader } = require('./yaml-loader');

describe('YAMLLoader.app', () => {
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
  const yaml = makeYAMLLoader(readerMock);

  it('without input', () => {
    expect(() => {
      yaml();
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
      title: 'valid yaml',
      input: `conventional-commits:
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
      input: 'conventional-commits.yml',
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
      if (t.expected !== undefined) {
        const input = yaml(t.input);
        expect(input).toEqual(t.expected);
      } else {
        expect(() => {
          yaml(t.input);
        }).toThrow();
      }
    });
  });
});
