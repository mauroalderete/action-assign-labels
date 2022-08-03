const core = require('@actions/core')
const core = require('@actions/github')

try {
    const pullRequestNumber = core.getInput('pull-request-number')
    const githubToken = core.getInput('github-token')
    const clearAllLabelsToStart = core.getInput('clear-all-labels-to-start')
    const removeLabelsNotFound = core.getInput('remove-labels-not-found')
    const conventionalCommits = core.getInput('conventional-commits')
    const notApplyChanges = core.getInput('not-apply-changes')

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`Payload: ${payload}`)

} catch (error) {
    core.setFailed(error.message)
}
