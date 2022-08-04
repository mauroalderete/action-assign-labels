/* eslint-disable no-unused-vars */
const BoolInput = require('./boolActionInput');

describe('BoolInput', () => {
  it('without input', () => {
    expect(() => {
      const input = new BoolInput();
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
        const input = new BoolInput(t.input);
        expect(input.value).toBe(t.expected);
      } else {
        expect(() => {
          const input = new BoolInput(null);
        }).toThrow();
      }
    });
  });
});
