const { makeInputConfigurator } = require('./inputConfigurator');

describe('inputConfigurator', () => {
  it('construct', () => {

  });

  const config = makeInputConfigurator();

  const denyUndefined = (input) => config(input).denyUndefined();
  const denyNull = (input) => config(input).denyNull();
  const denyEmpty = (input) => config(input).denyEmpty();
  const denyVoid = (input) => config(input).denyVoid();
  const toString = (input) => config(input).toString();
  const toInt = (input) => config(input).toInt();
  const toBool = (input) => config(input).toBool();

  const target = [
    {
      title: 'denyUndefined', input: undefined, expectedThrow: true, test: denyUndefined,
    },
    {
      title: 'denyUndefined', input: 1, expectedValue: 1, test: denyUndefined,
    },
    {
      title: 'denyNull', input: null, expectedThrow: true, test: denyNull,
    },
    {
      title: 'denyNull', input: undefined, expectedValue: undefined, test: denyNull,
    },
    {
      title: 'denyNull', input: 1, expectedValue: 1, test: denyNull,
    },
    {
      title: 'denyEmpty', input: undefined, expectedValue: undefined, test: denyEmpty,
    },
    {
      title: 'denyEmpty', input: null, expectedValue: null, test: denyEmpty,
    },
    {
      title: 'denyEmpty', input: '', expectedThrow: true, test: denyEmpty,
    },
    {
      title: 'denyEmpty', input: 'some', expectedValue: 'some', test: denyEmpty,
    },
    {
      title: 'denyVoid', input: undefined, expectedThrow: true, test: denyVoid,
    },
    {
      title: 'denyVoid', input: null, expectedThrow: true, test: denyVoid,
    },
    {
      title: 'denyVoid', input: '', expectedThrow: true, test: denyVoid,
    },
    {
      title: 'denyVoid', input: 'some', expectedValue: 'some', test: denyVoid,
    },
    {
      title: 'toString', input: undefined, expectedValue: 'undefined', test: toString,
    },
    {
      title: 'toString', input: null, expectedValue: 'null', test: toString,
    },
    {
      title: 'toString', input: '', expectedValue: '', test: toString,
    },
    {
      title: 'toString', input: 12, expectedValue: '12', test: toString,
    },
    {
      title: 'toString', input: true, expectedValue: 'true', test: toString,
    },
    {
      title: 'toString', input: 3.1415, expectedValue: '3.1415', test: toString,
    },
    {
      title: 'toInt', input: undefined, expectedThrow: true, test: toInt,
    },
    {
      title: 'toInt', input: null, expectedThrow: true, test: toInt,
    },
    {
      title: 'toInt', input: '', expectedThrow: true, test: toInt,
    },
    {
      title: 'toInt', input: 'some', expectedThrow: true, test: toInt,
    },
    {
      title: 'toInt', input: true, expectedThrow: true, test: toInt,
    },
    {
      title: 'toInt', input: {}, expectedThrow: true, test: toInt,
    },
    {
      title: 'toInt', input: '3.1415', expectedValue: 3, test: toInt,
    },
    {
      title: 'toInt string', input: '123', expectedValue: 123, test: toInt,
    },
    {
      title: 'toInt int', input: 123, expectedValue: 123, test: toInt,
    },
    {
      title: 'toBool', input: undefined, expectedThrow: true, test: toBool,
    },
    {
      title: 'toBool', input: null, expectedThrow: true, test: toBool,
    },
    {
      title: 'toBool', input: '', expectedThrow: true, test: toBool,
    },
    {
      title: 'toBool', input: 1, expectedThrow: true, test: toBool,
    },
    {
      title: 'toBool string', input: 'true', expectedValue: true, test: toBool,
    },
    {
      title: 'toBool string', input: 'True', expectedValue: true, test: toBool,
    },
    {
      title: 'toBool string', input: 'TRUE', expectedValue: true, test: toBool,
    },
    {
      title: 'toBool', input: true, expectedValue: true, test: toBool,
    },
    {
      title: 'toBool string', input: 'false', expectedValue: false, test: toBool,
    },
    {
      title: 'toBool string', input: 'False', expectedValue: false, test: toBool,
    },
    {
      title: 'toBool string', input: 'FALSE', expectedValue: false, test: toBool,
    },
    {
      title: 'toBool', input: false, expectedValue: false, test: toBool,
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

        const res = t.test(t.input);
        expect(res.value).toBe(t.expectedValue);
      }
    });
  });
});
