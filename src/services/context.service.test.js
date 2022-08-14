const { makeContexter } = require('./context.service');

const expected = {
  pull_request: {
    number: 100,
  },
};

const readerSyncMock = (path) => {
  if (path !== 'context') {
    throw new Error('file not found');
  }

  return JSON.stringify(expected);
};

describe('context', () => {
  it('without context file', () => {
    const getContext = makeContexter(readerSyncMock);
    expect(() => {
      getContext('');
    }).toThrow();
  });

  it('with context file', () => {
    const getContext = makeContexter(readerSyncMock);
    const context = getContext('context');
    expect(context).toEqual(expected);
  });
});
