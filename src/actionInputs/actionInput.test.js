/* eslint-disable no-unused-vars */
const ActionInput = require('./actionInput');

describe('ActionInput', () => {
  it('without input', () => {
    expect(() => {
      const input = new ActionInput();
    }).toThrow();
  });

  const targets = [
    {
      title: 'undefined input', input: undefined, config: undefined,
    },
    {
      title: 'undefined input allowed', input: undefined, config: { allowUndefined: true }, expected: undefined,
    },
    {
      title: 'null input', input: null, config: undefined,
    },
    {
      title: 'null input allowed', input: null, config: { allowNull: true }, expected: null,
    },
    {
      title: 'string input', input: '', config: undefined, expected: '',
    },
    {
      title: 'number input', input: 45, config: undefined, expected: 45,
    },
    {
      title: 'float input', input: 3.14, config: undefined, expected: 3.14,
    },
    {
      title: 'bool input', input: true, config: undefined, expected: true,
    },
  ];

  targets.forEach((t) => {
    it(t.title, () => {
      if (t.expected) {
        const input = new ActionInput(t.input, t.config);
        expect(input.value).toBe(t.expected);
      } else {
        expect(() => {
          const input = new ActionInput(null, t.config);
        }).toThrow();
      }
    });
  });
});
