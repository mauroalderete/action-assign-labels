/* eslint-disable no-unused-vars */
const BoolActionInput = require('./boolActionInput');

describe('BoolInput', () => {
  it('without input', () => {
    expect(() => {
      const input = new BoolActionInput();
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
      title: 'bool input', input: true,
    },
    {
      title: 'valid true input', input: 'true', expected: true,
    },
    {
      title: 'valid false input', input: 'false', expected: false,
    },
  ];

  targets.forEach((t) => {
    it(t.title, () => {
      if (t.expected) {
        const input = new BoolActionInput(t.input);
        expect(input.value).toBe(t.expected);
      } else {
        expect(() => {
          const input = new BoolActionInput(null);
        }).toThrow();
      }
    });
  });

  it('throw with id', () => {
    const value = undefined;
    const id = 'input-test';

    expect(() => {
      const input = new BoolActionInput(value, { id });
    }).toThrowError(new Error(`input ${id} value '${value}' can't be undefined`));
  });
});
