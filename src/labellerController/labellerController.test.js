const labellerController = require('./labellerController');
const YAMLActionInput = require('../actionInputs/YAMLActionInput');

describe('labellerController', () => {
  describe('changeLabels', () => {
    describe('validations', () => {
      it('without current labels list', () => {
        expect(() => { labellerController.changeLabels(); }).toThrow();
      });

      it('undefined current labels list', () => {
        expect(() => { labellerController.changeLabels(undefined); }).toThrow();
      });

      it('null current labels list', () => {
        expect(() => { labellerController.changeLabels(null); }).toThrow();
      });

      it('with current labels list invalid', () => {
        expect(() => { labellerController.changeLabels({}); }).toThrow();
      });

      it('without change by labels list', () => {
        expect(() => { labellerController.changeLabels([]); }).toThrow();
      });

      it('undefined change by labels list', () => {
        expect(() => { labellerController.changeLabels([], undefined); }).toThrow();
      });

      it('null change by labels list', () => {
        expect(() => { labellerController.changeLabels([], null); }).toThrow();
      });

      it('with change by labels list invalid', () => {
        expect(() => { labellerController.changeLabels([], {}); }).toThrow();
      });

      it('without config', () => {
        expect(() => { labellerController.changeLabels([], []); }).toThrow();
      });

      it('undefined config', () => {
        expect(() => { labellerController.changeLabels([], [], undefined); }).toThrow();
      });

      it('null config', () => {
        expect(() => { labellerController.changeLabels([], [], null); }).toThrow();
      });

      it('with config invalid object', () => {
        expect(() => { labellerController.changeLabels([], [], 'a'); }).toThrow();
      });

      it('config without maintainLabelsNotFound field', () => {
        expect(() => {
          labellerController.changeLabels([], [], {
            conventionalCommitsScheme: false,
          });
        }).toThrow();
      });

      it('config with maintainLabelsNotFound invalid field', () => {
        expect(() => {
          labellerController.changeLabels([], [], {
            maintainLabelsNotFound: 'true',
            conventionalCommitsScheme: {},
          });
        }).toThrow();
      });

      it('config without conventionalCommitsScheme field', () => {
        expect(() => {
          labellerController.changeLabels([], [], {
            maintainLabelsNotFound: true,
          });
        }).toThrow();
      });
    });

    describe('parse', () => {
      const cc = new YAMLActionInput('./src/actionInputs/__mocks__/conventional-commits.yml');

      const targets = [
        {
          title: 'all empty',
          input: {
            currentLabels: [],
            changeByLabels: [],
            config: {
              maintainLabelsNotFound: true,
              conventionalCommitsScheme: cc.value,
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
              conventionalCommitsScheme: cc.value,
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
              conventionalCommitsScheme: cc.value,
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
              conventionalCommitsScheme: cc.value,
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
              conventionalCommitsScheme: cc.value,
            },
          },
          expect: {
            next: ['bug', 'feat'],
            added: ['feat'],
            removed: ['BREAKING CHANGE'],
          },
        },
      ];

      targets.forEach((t) => {
        it(t.title, () => {
          expect(
            labellerController.changeLabels(
              t.input.currentLabels,
              t.input.changeByLabels,
              t.input.config,
            ),
          ).toEqual(expect.arrayContaining([t.expect.next, t.expect.added, t.expect.removed]));
        });
      });
    });
  });
});
