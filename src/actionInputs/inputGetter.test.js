const { makeInputConfigurator } = require('./inputConfigurator');
const { makeInputGetter } = require('./inputGetter');

describe('inputGetter', () => {
  it('construct', () => {

  });

  const configurator = makeInputConfigurator();
  const get = makeInputGetter((name) => {
    switch (name) {
      case 'number-input':
        return 100;
      case 'string-input':
        return 'some';
      case 'bool-input':
        return true;
      default: {
        return undefined;
      }
    }
  }, configurator);

  const testNumberInput = (name) => get(name, (opt) => {
    opt
      .denyUndefined()
      .denyNull()
      .denyEmpty()
      .toInt();
  });

  const target = [
    {
      title: 'numberInput', input: undefined, expectedThrow: true, test: testNumberInput,
    },
    {
      title: 'numberInput', input: null, expectedThrow: true, test: testNumberInput,
    },
    {
      title: 'numberInput', input: '', expectedThrow: true, test: testNumberInput,
    },
    {
      title: 'numberInput', input: 'bool-input', expectedThrow: true, test: testNumberInput,
    },
    {
      title: 'numberInput', input: 'string-input', expectedThrow: true, test: testNumberInput,
    },
    {
      title: 'numberInput', input: 'number-input', expectedValue: 100, test: testNumberInput,
    },
    {
      title: 'numberInput without opt', input: 'number-input', expectedValue: 100, test: (name) => get(name),
    },
  ];

  target.forEach((t) => {
    it(`${t.title} ${t.input}`, () => {
      if (t.expectedThrow) {
        expect(() => {
          t.test(t.input);
        }).toThrow();
      } else {
        expect(() => {
          t.test(t.input);
        }).not.toThrow();

        const value = t.test(t.input);
        expect(value).toBe(t.expectedValue);
      }
    });
  });
});
