/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const core = require('@actions/core');
const github = require('@actions/github');
const inputPullRequestNumber = require('./inputs/pullRequestNumber');
const inputGithubToken = require('./inputs/githubToken');

try {
  const pullRequestNumber = inputPullRequestNumber.parse(core.getInput('pull-request-number'));
  const githubToken = inputGithubToken.parse(core.getInput('github-token'));

  // const clearAllLabelsToStart = core.getInput('clear-all-labels-to-start');
  // const removeLabelsNotFound = core.getInput('remove-labels-not-found');
  // const conventionalCommits = core.getInput('conventional-commits');
  // const notApplyChanges = core.getInput('not-apply-changes');

  const payload = JSON.stringify(github.context.payload, undefined, 2);

  console.log(`Payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
