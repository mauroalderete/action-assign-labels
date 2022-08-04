/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const core = require('@actions/core');
const github = require('@actions/github');

const BoolActionInput = require('./actionInputs/boolActionInput');
const IntegerActionInput = require('./actionInputs/integerActionInput');
const StringActionInput = require('./actionInputs/stringActionInput');
const YAMLActionInput = require('./actionInputs/YAMLActionInput');

const inputPullRequestNumber = 'pull-request-number';
const inputGithubToken = 'github-token';
const inputCleanLabels = 'clear-all-labels-to-start';
const inputRemoveLabelsNotFound = 'maintain-labels-not-matched';
const inputApplyChanges = 'apply-changes';
const inputConventionalCommits = 'conventional-commits';

try {
  core.setOutput('labels-before-update', '');
  core.setOutput('labels-added', '');
  core.setOutput('labels-removed', '');
  core.setOutput('labels-after-update', '');
  core.setOutput('action-status', 'STARTED');
  core.setOutput('action-message', '');

  const pullRequestNumber = new IntegerActionInput(
    core.getInput(inputPullRequestNumber),
    { id: inputPullRequestNumber },
  );
  const githubToken = new StringActionInput(
    core.getInput(inputGithubToken),
    { id: inputGithubToken },
  );
  const cleanLabels = new BoolActionInput(
    core.getInput(inputCleanLabels),
    { id: inputCleanLabels },
  );
  const removeLabelsNotFound = new BoolActionInput(
    core.getInput(inputRemoveLabelsNotFound),
    { id: inputRemoveLabelsNotFound },
  );
  const ApplyChanges = new BoolActionInput(
    core.getInput(inputApplyChanges),
    { id: inputApplyChanges },
  );
  const conventionalCommits = new YAMLActionInput(
    core.getInput(inputConventionalCommits),
    { id: inputConventionalCommits },
  );

  core.setOutput('action-status', 'VALIDATED');

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`CC: ${JSON.stringify(conventionalCommits.value)}`);
  console.log(`Payload: ${payload}`);

  core.setOutput('action-status', 'PARSED');

  core.setOutput('action-status', 'ENDED');
} catch (error) {
  core.setOutput('action-message', error.message);
  core.setFailed(error.message);
}
