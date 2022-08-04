/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const core = require('@actions/core');
const github = require('@actions/github');

const BoolActionInput = require('./actionInputs/boolActionInput');
const IntegerActionInput = require('./actionInputs/integerActionInput');
const StringActionInput = require('./actionInputs/stringActionInput');
const YAMLActionInput = require('./actionInputs/YAMLActionInput');

try {
  core.setOutput('labels-before-update', []);
  core.setOutput('labels-added', []);
  core.setOutput('labels-removed', []);
  core.setOutput('labels-after-update', []);
  core.setOutput('action-status', 'STARTED');
  core.setOutput('action-message', '');

  const pullRequestNumber = new IntegerActionInput(core.getInput('pull-request-number'));
  const githubToken = new StringActionInput(core.getInput('github-token'));
  const cleanLabels = new BoolActionInput(core.getInput('clear-all-labels-to-start'));
  const removeLabelsNotFound = new BoolActionInput(core.getInput('remove-labels-not-found'));
  const notApplyChanges = new BoolActionInput(core.getInput('not-apply-changes'));
  const conventionalCommits = new YAMLActionInput(core.getInput('conventional-commits'));

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
