const { mainApp } = require('./main.app');

const coreMock = {
  getInput: (name) => {
    if (name === 'pull-request-number') {
      return '0';
    }
    return undefined;
  },
};

describe('Main App', () => {
  it('run', () => {
    const app = mainApp(coreMock);
    console.log('run app');
    app();
    expect(1).toBe(1);
  });
});
