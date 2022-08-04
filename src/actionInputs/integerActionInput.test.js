/* eslint-disable no-unused-vars */
const IntegerInput = require('./integerActionInput');

describe('IntegerInput', () => {
  it('without input', () => {
    expect(() => {
      const input = new IntegerInput();
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
      title: 'bad string input', input: 'bad string',
    },
    {
      title: 'number input', input: 45,
    },
    {
      title: 'float input', input: 3.14,
    },
    {
      title: 'string float input', input: '3.14',
    },
    {
      title: 'bool input', input: true,
    },
    {
      title: 'valid negative input', input: '-273', expected: -273,
    },
    {
      title: 'valid zero input', input: '0', expected: 0,
    },
    {
      title: 'valid positive input', input: '79', expected: 79,
    },
  ];
  targets.forEach((t) => {
    it(t.title, () => {
      if (t.expected) {
        const input = new IntegerInput(t.input);
        expect(input.value).toBe(t.expected);
      } else {
        expect(() => {
          const input = new IntegerInput(null);
        }).toThrow();
      }
    });
  });
});
