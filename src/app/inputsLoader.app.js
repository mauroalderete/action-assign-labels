const makeInputsLoader = (getInputClient, YAMLLoaderClient) => () => {
  try {
    const pullRequestNumber = getInputClient('pull-request-number', (opt) => {
      opt.denyVoid().toInt();

      if (opt.value <= 0) {
        throw new Error(`value ${opt.value} of the pull-request-number must be a positive number`);
      }
    });

    const githubToken = getInputClient('github-token', (opt) => {
      opt.denyVoid().toString();
    });

    const maintainLabelsNotFound = getInputClient('maintain-labels-not-matched', (opt) => {
      opt.denyVoid().toBool();
    });

    const applyChanges = getInputClient('apply-changes', (opt) => {
      opt.denyVoid().toBool();
    });

    const conventionalCommits = getInputClient('conventional-commits', (options) => {
      options.denyVoid().toString().use((opt) => {
        try {
          const content = YAMLLoaderClient(opt.value);
          // eslint-disable-next-line no-param-reassign
          opt.value = content;
        } catch (error) {
          throw new Error(`failed to parse yaml from ${opt.value} :${error}`);
        }
      });
    });

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

module.exports = { makeInputsLoader };
