/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const core = require('@actions/core');
const fs = require('fs');

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

const validEvents = ['pull_request'];

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

  const { eventName } = process.env.GITHUB_EVENT_NAME;

  // if (pullRequestNumber.value === 0) {
  //   if (eventName === 'pull_request') {
  //     pullRequestNumber.value = github.context.pull_request.number;
  //   } else {
  //     throw new Error(`The current event '${eventName}' need a valid pull_request_number`);
  //   }
  // }

  const contextPaylaod = (() => fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }))();
  console.log('env: ', process.env);
  console.log('contextEvent', contextPaylaod);

  core.setOutput('action-status', 'VALIDATED');

  // const labelsBefore = github.context.payload.pull_request.labels;
  // core.setOutput('labels-before-update', labelsBefore.map((l) => l.name));

  // eslint-disable-next-line dot-notation
  // const commitsLink = github.context.payload.pull_request['_links'].commits;

  // get all commits of the pull request
  // const octokit = new github.GitHub(githubToken.value);
  // const commits = await octokit.pulls.ListCommits({

  // });

  // recovery commits

  console.log(`CC: ${JSON.stringify(conventionalCommits.value)}`);

  core.setOutput('action-status', 'PARSED');

  core.setOutput('action-status', 'ENDED');
} catch (error) {
  core.setOutput('action-message', error.message);
  core.setFailed(error.message);
}
