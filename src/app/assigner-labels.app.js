/**
 * It contains the functions to assign new labels to a pull request.
 * @module src/app/assigner-labels.app
 */

// eslint-disable-next-line no-unused-vars
const loader = require('./input-loader.app');
// eslint-disable-next-line no-unused-vars
const concom = require('../lib/conventional-commits/conventional-commits');
// eslint-disable-next-line no-unused-vars
const pullRequestService = require('../services/pullrequest.service');
// eslint-disable-next-line no-unused-vars
const contextModule = require('../services/context.service');

/**
 * Construct a {@link assignerLabelsFunc `assignerLabelsFunc`} function
 * to execute the assignment of labels in a pull request.
 * @param {loader.inputLoaderFunc} loadInputs Function to load the action inputs.
 * See {@link loader.inputLoaderFunc `inputLoaderFunc`}.
 * @param {string[]} changeLabels Labels list to assign in the pull request.
 * @param {concom.getTypesInCommits} getTypesInCommits Parser function to identify and recover
 * a list of the conventional-commits types available in the pull request commits.
 * See {@link concom.getTypesInCommits `getTypesInCommits`}
 * @param {pullRequestService.githubAPIClientType} GithubClient
 * An instance of the Github API client.
 * See {@link pullRequestService.githubAPIClientType `githubAPIClientType`}
 * @param {pullRequestService.makePullRequestService} makePullRequestService
 * The constructor of a service that manages requests using a Github API client.
 * See {@link pullRequestService.makePullRequestService `makePullRequestService`}
 * @returns {assignerLabelsFunc}
 */
module.exports.makeAssignerLabelsApp = (
  loadInputs,
  changeLabels,
  getTypesInCommits,
  GithubClient,
  makePullRequestService,
) => async (actionContext) => {
  const inputs = loadInputs();

  process.env.GITHUB_TOKEN = inputs.githubToken;
  const pullrequestService = makePullRequestService(new GithubClient());

  const [owner, repo] = actionContext.repository.full_name.split('/');

  if (actionContext.pull_request && actionContext.pull_request.number) {
    inputs.pullRequestNumber = actionContext.pull_request.number;
  }

  const pr = await pullrequestService.getPullRequest(
    owner,
    repo,
    inputs.pullRequestNumber,
  );

  const labelsBefore = pr.labels;
  const labelsBeforeName = labelsBefore.map((l) => l.name);

  const commits = await pullrequestService.getCommits(
    owner,
    repo,
    inputs.pullRequestNumber,
  );

  const types = getTypesInCommits(
    commits.map((c) => c.commit.message),
    inputs.conventionalCommits,
  );

  const labelsToChange = types.length > 0
    ? types.map((t) => t.labels).reduce((tp, tc) => tp.concat(tc))
    : [];

  const result = changeLabels(
    labelsBeforeName,
    labelsToChange,
    {
      maintainLabelsNotFound: inputs.maintainLabelsNotFound,
      conventionalCommitsScheme: inputs.conventionalCommits,
    },
  );

  const [next, added, removed] = result;

  if (inputs.applyChanges === true) {
    pullrequestService.setLabels(
      owner,
      repo,
      inputs.pullRequestNumber,
      next,
    );
  }

  return [labelsBeforeName, added, removed, next];
};

/**
 * Parse inputs and pull request payload to find the conventional-commits
 * and assign to pull request the labels that correspond
 * according to conventional-commits scheme.
 *
 * Require the action context to get metadata
 * that allows it execute the requests to the Github API.
 * @callback assignerLabelsFunc
 * @param {contextModule.actionContext} actionContext Github Action context object.
 * See {@link contextModule.actionContext `actionContext`}
 * @return {labelsChanges} Array with the labels list modified by the function.
 * See {@link labelsChanges `labelsChanges`}
 */

/**
 * @typedef {Array} labelsChanged
 * @property {string[]} labelsBeforeName Contains the old labels list without any changes applied.
 * @property {string[]} next Contains the new labels list with all changes applied.
 * @property {string[]} added Is a list with all labels added to the old list.
 * @property {string[]} removed Is a list with all labels removed from the old list.
 */
