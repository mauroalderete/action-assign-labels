const { changeLabels } = require('./label-updater');
const { makeYAMLLoader } = require('../yaml-loader/yaml-loader');

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

const yamlLoader = makeYAMLLoader(readerMock);

describe('label-updater', () => {
  describe('validations', () => {
    it('without current labels list', () => {
      expect(() => { changeLabels(); }).toThrow();
    });

    it('undefined current labels list', () => {
      expect(() => { changeLabels(undefined); }).toThrow();
    });

    it('null current labels list', () => {
      expect(() => { changeLabels(null); }).toThrow();
    });

    it('with current labels list invalid', () => {
      expect(() => { changeLabels({}); }).toThrow();
    });

    it('without change by labels list', () => {
      expect(() => { changeLabels([]); }).toThrow();
    });

    it('undefined change by labels list', () => {
      expect(() => { changeLabels([], undefined); }).toThrow();
    });

    it('null change by labels list', () => {
      expect(() => { changeLabels([], null); }).toThrow();
    });

    it('with change by labels list invalid', () => {
      expect(() => { changeLabels([], {}); }).toThrow();
    });

    it('without config', () => {
      expect(() => { changeLabels([], []); }).toThrow();
    });

    it('undefined config', () => {
      expect(() => { changeLabels([], [], undefined); }).toThrow();
    });

    it('null config', () => {
      expect(() => { changeLabels([], [], null); }).toThrow();
    });

    it('with config invalid object', () => {
      expect(() => { changeLabels([], [], 'a'); }).toThrow();
    });

    it('config without maintainLabelsNotFound field', () => {
      expect(() => {
        changeLabels([], [], {
          conventionalCommitsScheme: false,
        });
      }).toThrow();
    });

    it('config without conventionalCommitsScheme field', () => {
      expect(() => {
        changeLabels([], [], {
          maintainLabelsNotFound: true,
        });
      }).toThrow();
    });
  });

  describe('parse', () => {
    const cc = yamlLoader('conventional-commits.yml');

    const targets = [
      {
        title: 'all empty',
        input: {
          currentLabels: [],
          changeByLabels: [],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: [],
          added: [],
          removed: [],
        },
      },
      {
        title: 'only added',
        input: {
          currentLabels: [],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'feat'],
          added: ['bug', 'feat'],
          removed: [],
        },
      },
      {
        title: 'add one more',
        input: {
          currentLabels: ['bug'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'feat'],
          added: ['feat'],
          removed: [],
        },
      },
      {
        title: 'add one more and maintain not found',
        input: {
          currentLabels: ['bug', 'BREAKING CHANGE'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'BREAKING CHANGE', 'feat'],
          added: ['feat'],
          removed: [],
        },
      },
      {
        title: 'add one more and remove not found',
        input: {
          currentLabels: ['bug', 'BREAKING CHANGE'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: false,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'feat'],
          added: ['feat'],
          removed: ['BREAKING CHANGE'],
        },
      },
      {
        title: 'only added with others',
        input: {
          currentLabels: ['build'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['build', 'bug', 'feat'],
          added: ['bug', 'feat'],
          removed: [],
        },
      },
      {
        title: 'add one more with others',
        input: {
          currentLabels: ['bug', 'build'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'build', 'feat'],
          added: ['feat'],
          removed: [],
        },
      },
      {
        title: 'add one more and maintain not found with others',
        input: {
          currentLabels: ['bug', 'BREAKING CHANGE', 'build'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: true,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'BREAKING CHANGE', 'build', 'feat'],
          added: ['feat'],
          removed: [],
        },
      },
      {
        title: 'add one more and remove not found with others',
        input: {
          currentLabels: ['bug', 'BREAKING CHANGE', 'build'],
          changeByLabels: ['bug', 'feat'],
          config: {
            maintainLabelsNotFound: false,
            conventionalCommitsScheme: cc,
          },
        },
        expect: {
          next: ['bug', 'build', 'feat'],
          added: ['feat'],
          removed: ['BREAKING CHANGE'],
        },
      },
    ];

    targets.forEach((t) => {
      it(t.title, () => {
        expect(
          changeLabels(
            t.input.currentLabels,
            t.input.changeByLabels,
            t.input.config,
          ),
        ).toEqual(expect.arrayContaining([t.expect.next, t.expect.added, t.expect.removed]));
      });
    });
  });
});
