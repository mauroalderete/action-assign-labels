const pullRequestNumber = require('./pullRequestNumber');

describe('pullrequest-number input', () => {
  describe('validate pull-request number', () => {
    it('without value', () => {
      expect(() => {
        pullRequestNumber.validate();
      }).toThrow();
    });

    it('null value', () => {
      expect(() => {
        pullRequestNumber.validate(null);
      }).toThrow();
    });

    it('undefined value', () => {
      expect(() => {
        pullRequestNumber.validate(undefined);
      }).toThrow();
    });

    it('empty value', () => {
      expect(() => {
        pullRequestNumber.validate('');
      }).toThrow();
    });

    it('not numeric value', () => {
      expect(() => {
        pullRequestNumber.validate('asd');
      }).toThrow();
    });

    it('numeric value', () => {
      expect(() => {
        pullRequestNumber.validate('45');
      }).not.toThrow();
    });
  });

  describe('parse pull-request number', () => {
    it('numeric value', () => {
      expect(pullRequestNumber.parse('45')).toBe(45);
    });

    it('not numeric value', () => {
      expect(() => {
        pullRequestNumber.parse('asd');
      }).toThrow();
    });
  });
});
