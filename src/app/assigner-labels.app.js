const makeAssignerLabelsApp = (
  loadInputs,
  changeLabels,
  getTypesInCommits,
  pullRequestService,
) => async (context) => {
  const inputs = loadInputs();

  const [owner, repo] = context.repository.full_name.split('/');

  if (context.pull_request.number) {
    inputs.pullRequestNumber = context.pull_request.number;
  }

  const pr = await pullRequestService.getPullRequest(
    owner,
    repo,
    inputs.pullRequestNumber,
  );

  const labelsBefore = pr.labels;
  const labelsBeforeName = labelsBefore.map((l) => l.name);

  const commits = await pullRequestService.getCommits(
    owner,
    repo,
    inputs.pullRequestNumber,
  );

  const types = getTypesInCommits(
    commits.map((c) => c.commit.message),
    inputs.conventionalCommits,
  );

  const labelsToChange = types.map((t) => t.labels).reduce((tp, tc) => tp.concat(tc));

  const result = changeLabels(
    labelsBeforeName,
    labelsToChange,
    {
      maintainLabelsNotFound: inputs.maintainLabelsNotFound,
      conventionalCommitsScheme: inputs.conventionalCommits,
    },
  );

  const [next, added, removed] = result;

  if (inputs.applyChanges) {
    pullRequestService.setLabels(
      owner,
      repo,
      inputs.pullRequestNumber,
      next,
    );
  }

  return [labelsBeforeName, added, removed, next];
};

module.exports = { makeAssignerLabelsApp };
