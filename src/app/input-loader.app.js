const parser = require('../lib/parser/parser');

const makeInputLoader = (
  stringInputClient,
  booleanInputClient,
  YAMLLoaderClient,
) => () => {
  try {
    let pullRequestNumber = stringInputClient('pull-request-number');
    pullRequestNumber = parser(pullRequestNumber).toInt().use((p) => {
      if (p.value < 0) {
        throw new Error(`value ${p.value} of the pull-request-number must be a positive number`);
      }
    }).value;

    const githubToken = stringInputClient('github-token', { required: true });
    const maintainLabelsNotFound = booleanInputClient('maintain-labels-not-matched');
    const applyChanges = booleanInputClient('apply-changes');
    let conventionalCommits = stringInputClient('conventional-commits');
    conventionalCommits = parser(conventionalCommits).use((p) => {
      try {
        // eslint-disable-next-line no-param-reassign
        p.value = YAMLLoaderClient(p.value);
      } catch (error) {
        throw new Error(`failed to parse yaml from ${p.value} :${error}`);
      }
    }).denyUndefined().denyNull().value;

    return {
      pullRequestNumber,
      githubToken,
      maintainLabelsNotFound,
      applyChanges,
      conventionalCommits,
    };
  } catch (error) {
    throw new Error(`failed to load inputs: ${error}`);
  }
};

module.exports = { makeInputLoader };
