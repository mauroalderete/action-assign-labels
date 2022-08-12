const makeInputsLoader = (getInput) => () => {
  try {
    const pullRequestNumber = getInput('pull-request-number', (opt) => {
      console.log('opt is ', opt);
      opt
        .denyUndefined()
        .denyNull()
        .toInt();
      console.log('opt will', opt);
    });

    return {
      pullRequestNumber,
      githubToken: '',
      maintainLabelsNotFound: false,
      applyChanges: true,
      conventionalCommits: '',
    };
  } catch (error) {
    throw new Error(`failed to load inputs: ${error}`);
  }
};

module.exports = { makeInputsLoader };
