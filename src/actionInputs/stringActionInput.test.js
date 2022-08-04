/* eslint-disable no-unused-vars */
const StringActionInput = require('./YAMLActionInput');

describe('StringActionInput', () => {
  it('without input', () => {
    expect(() => {
      const input = new StringActionInput();
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
      title: 'empty string input', input: '', expected: '',
    },
    {
      title: 'some string', input: 'something', expected: 'something',
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
  ];
  targets.forEach((t) => {
    it(t.title, () => {
      if (t.expected) {
        const input = new StringActionInput(t.input);
        expect(input.value).toBe(t.expected);
      } else {
        expect(() => {
          const input = new StringActionInput(null);
        }).toThrow();
      }
    });
  });
});
