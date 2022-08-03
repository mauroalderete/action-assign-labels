const githubToken = require('./githubToken');

describe('github-token input', () => {
  describe('validate pull-request number', () => {
    it('without value', () => {
      expect(() => {
        githubToken.validate();
      }).toThrow();
    });

    it('null value', () => {
      expect(() => {
        githubToken.validate(null);
      }).toThrow();
    });

    it('undefined value', () => {
      expect(() => {
        githubToken.validate(undefined);
      }).toThrow();
    });

    it('empty value', () => {
      expect(() => {
        githubToken.validate('');
      }).toThrow();
    });

    it('with token', () => {
      expect(() => {
        githubToken.validate('some token');
      }).not.toThrow();
    });
  });

  describe('parse github-token', () => {
    const token = 'abcde123456';
    it('with token', () => {
      expect(githubToken.parse(token)).toBe(token);
    });
  });
});
