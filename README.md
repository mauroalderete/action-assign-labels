# action-assign-labels <!-- omit in toc -->

<h4 align="center"><b>Assign labels to pull-request parsing conventional commits standard</b></h4>

&nbsp;
<div align="center">

<a href="https://github.com/mauroalderete/action-assign-labels/blob/main/LICENSE">
	<img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
</a>
<a href="https://github.com/mauroalderete/action-assign-labels/blob/main/CODE_OF_CONDUCT.md">
	<img alt="Contributor covenant: 2.1" src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg">
</a>
<a href="https://semver.org/">
	<img alt="Semantic Versioning: 2.0.0" src="https://img.shields.io/badge/Semantic--Versioning-2.0.0-a05f79?logo=semantic-release&logoColor=f97ff0">
</a>

[![Tests](https://github.com/mauroalderete/action-assign-labels/actions/workflows/tests.yml/badge.svg)](https://github.com/mauroalderete/action-assign-labels/actions/workflows/tests.yml)
[![CodeQL](https://github.com/mauroalderete/action-assign-labels/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/mauroalderete/action-assign-labels/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/mauroalderete/action-assign-labels/branch/main/graph/badge.svg?token=CLP8TDLSKG)](https://codecov.io/gh/mauroalderete/action-assign-labels)

<a href="https://github.com/mauroalderete/action-assign-labels/issues/new/choose">Report Bug</a>
·
<a href="https://github.com/mauroalderete/action-assign-labels/issues/new/choose">Request Feature</a>

<a href="https://twitter.com/intent/tweet?text=👋%20Check%20this%20amazing%20repo%20https://github.com/mauroalderete/action-assign-labels,%20created%20by%20@_mauroalderete%0A%0A%23100DaysOfCode%20%23Github%20%23githubactions%20✌️">
	<img src="https://img.shields.io/twitter/url?label=Share%20on%20Twitter&style=social&url=https%3A%2F%2Fgithub.com%2Fatapas%2Fmodel-repo">
</a>
</div>

&nbsp;

# Content <!-- omit in toc -->

- [:wave: Introducing `action-assign-labels`](#wave-introducing-action-assign-labels)
- [:fire: Features](#fire-features)
  - [Fix, Feature, BREAKING CHANGE and more](#fix-feature-breaking-change-and-more)
  - [Assign Labels when you need it](#assign-labels-when-you-need-it)
  - [Output detailed](#output-detailed)
  - [Ommite changes in server](#ommite-changes-in-server)
  - [Status API](#status-api)
  - [Summary](#summary)
- [:computer: How to use `action-assign-labels`](#computer-how-to-use-action-assign-labels)
  - [Inputs](#inputs)
    - [github-token](#github-token)
    - [conventional-commits](#conventional-commits)
    - [pull-request-number](#pull-request-number)
    - [maintain-labels-not-matched](#maintain-labels-not-matched)
    - [apply-changes](#apply-changes)
  - [Outputs](#outputs)
    - [Action status](#action-status)
  - [Examples](#examples)
    - [Basic use](#basic-use)
    - [Extended use](#extended-use)
    - [Without apply and parsing output](#without-apply-and-parsing-output)
- [:hammer: How to Set up `action-assign-labels` for Development?](#hammer-how-to-set-up-action-assign-labels-for-development)
  - [Scripts](#scripts)
    - [Lint](#lint)
    - [Unit tests](#unit-tests)
    - [Build](#build)
- [:wrench: How to work?](#wrench-how-to-work)
- [:shield: License](#shield-license)
- [:handshake: Contributing to `action-assign-labels`](#handshake-contributing-to-action-assign-labels)
- [:pray: Support](#pray-support)

&nbsp;
# :wave: Introducing `action-assign-labels`
`action-assign-labels` is a Javascript GitHub Action that allows you to automate the label assignment to help you to identify and categorize a pull request.

It finds into commits pushed in a pull request to set the conventional-commits types to determine which labels must be assigned and which must be removed.

With a simple scheme written in yaml format, you will be able to customize the combinations between conventional-commits nouns and your labels names to integrate them easily into your unique workflow.

# :fire: Features

## Fix, Feature, BREAKING CHANGE and more

`action-assign-labels` uses the conventional-commits convention to extract the prefix from the commits and determine what labels will be assigned.

-- What nouns are available?
-- The ones you need!

You can use a simple conventional-commits scheme from a file or direct entry to customize your own convention.

## Assign Labels when you need it

It is not necessary to execute `action-assign-labels` just later `pull_request` or `pull_request_target` events are triggered. You can use the optional entry `pull-request-number` to assign labels to the specific pull requests at any time.

## Output detailed

Through the outputs, you can access details of all label lists affected by the action. You can know the labels added, and removed and at the same time, you can get a snapshot of the previous status and new status.
In this way, you can available all data to take a better workflow decision and integrate it easily with others' actions.

> By the way, did you already take a look at [`action-verify-labels`](https://github.com/marketplace/actions/verify-labels-in-pull-request)? It works great with `action-assign-labels`.

## Ommite changes in server

Using the `apply-changes` entry you will be able to execute the action without it making any changes to the server. This will allow you to take advantage of the available outputs and make the best decisions for your workflow.

## Status API

`action-assign-labels` provide the ```action-status``` and ```action-message``` outputs to notify you about any error event during the execution. In this way, you can take a better decision.

## Summary

`action-assign-labels` generate a friendly summary to that you can see speedily the operation result, pull request associated and end status.

# :computer: How to use `action-assign-labels`

Simply add a checkout to your repository. Then, add a new step in your workflow using the `mauroalderete/action-assign-labels` action. And ready, you can start to configure it with the behaviour that you wish. [See examples](#examples)

``` yaml
  - name: Execute assign labels
    id: action-assign-labels
    uses: mauroalderete/action-assign-labels@v1
    with:
      pull-request-number: ${{ github.event.pull_request.number }}
      github-token: ${{ secrets.GITHUB_TOKEN }}
      conventional-commits: |
        conventional-commits:
          - type: 'fix'
            nouns: ['FIX', 'Fix', 'fix', 'FIXED', 'Fixed', 'fixed']
            labels: ['bug']
          - type: 'feature'
            nouns: ['FEATURE', 'Feature', 'feature', 'FEAT', 'Feat', 'feat']
            labels: ['feature']
          - type: 'breaking_change'
            nouns: ['BREAKING CHANGE', 'BREAKING', 'MAJOR']
            labels: ['BREAKING CHANGE']
      maintain-labels-not-matched: false
      apply-changes: true
```

## Inputs

| Input                                    | Data type | Required | Default | Description                                                                                                                                   |
| :--------------------------------------- | :-------: | :------: | :-----: | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| <nobr>github-token</nobr>                |  string   |   true   |   ''    | The Github token.                                                                                                                             |
| <nobr>conventional-commits</nobr>        |  string   |   true   |   ''    | String with the YAML object or path to file YAML that contains a list with conventional commits and the labels matching that must be assigned |
| <nobr>pull-request-number</nobr>         |  number   |  false   |    0    | The pull request's number where labels will be assigned                                                                                       |
| <nobr>maintain-labels-not-matched</nobr> |  boolean  |  false   |  false  | You should keep the conventional commit tags assigned to the pull-request, even though they are no longer referenced within commits.          |
| <nobr>apply-changes</nobr>               |  boolean  |  false   |  true   | Should will be executing the action and save any change to the repository.                                                                    |

### github-token

It is always required, it doesn't matter if changes will be applied to the repository or not. It is used to request data about pull requests, his labels and his commits from [GitHub REST API](https://docs.github.com/es/rest).

### conventional-commits

This entry receives a conventional-commits scheme in YAML format.

This scheme is used to relate a specific conventional-commit type with the labels that must be assigned when a commit contains a prefix equal to some noun indicated in the scheme.

A conventional-commit type consists of three elements:

``` yaml 
- type: 'fix'
  nouns: ['fix', 'fixed']
  labels: ['bug']
```

- `type`, is a simple title to identify the conventional-commit type that we are defining.
- `nouns`, is a list of all prefix variants that indicate to us if a commit belongs to the conventional-commits type that we are defining.
- `labels`, is a list of the all labels that must be assigned to a pull request in case of that it contains some commit of the conventional-commit type that we are defining.

A conventional-commits scheme complete consist of a list of the conventional-commit types:

``` yaml
conventional-commits:
        - type: 'fix'
          nouns: ['fix', 'fixed']
          labels: ['bug']
        - type: 'feature'
          nouns: ['feat', 'feature']
          labels: ['enhancement']
        - type: 'breaking_change'
          nouns: ['BREAKING CHANGE']
          labels: ['BREAKING CHANGE']
```

This way, you can create all conventional-commits types that you need easily.

There is two way to enter a scheme in the action. One way is entry a multiline string with the yaml object:

``` yaml
- uses: mauroalderete/action-assign-labels@v1
  with:
    conventional-commits: |
      conventional-commits:
        - type: 'fix'
          nouns: ['FIX', 'Fix', 'fix', 'FIXED', 'Fixed', 'fixed']
          labels: ['bug']
        - type: 'feature'
          nouns: ['FEATURE', 'Feature', 'feature', 'FEAT', 'Feat', 'feat']
          labels: ['feature']
        - type: 'breaking_change'
          nouns: ['BREAKING CHANGE', 'BREAKING', 'MAJOR']
          labels: ['BREAKING CHANGE']
```

The other way is entry a path to the yaml file that contains the scheme.

``` yaml
- uses: mauroalderete/action-assign-labels@v1
  with:
    conventional-commits: './some/place/MyConventionalCommitScheme.yaml'
```
If you choose to pass a file, remember entry with workdir path or relative path. 

### pull-request-number

This is an optional entry. If you use `action-assign-label` when a type event `pull_request` or `pull_requesttarget` is triggered the pull request number is getting directly from the GitHub Action context. You don't need to provide it.

Otherwise, if you plan to use this action on another type of event then is needed to provide a pull request number valid, since this value will isn't available in the GitHub Action context.

A pull request number valid is any integer positive non-zero.
### maintain-labels-not-matched

It determines if labels from the pull requests and configured in the scheme must or not be removed when none of the commits pushed reference it.

By default is false. This means that when a label assigned is not matched any commit, this label will be removed.

This flag only has effect over labels defines in the conventional-commits scheme. This means that any label assigned that it isn't contained in the scheme will be ignored.

For example, we suppose a pull request has the `bug` label assigned that according to the conventional-commits scheme, only must be assigned if some commit contains the prefix `fix:`. What should happen to the label if suddenly the pull request no longer has any commits with the fixed prefix?

For this situations, the `maintain-labels-not-matched` entry allows you to determine if the 'bug' label must to remove or conserved.

Why would you want to conserve it? May be you need to be more flexible with the labels assignment and, you wish to allow them can be assigned manually.

Why would you want to removed it? May be you need to be more strict with the label assignment and, garantee a unique way of the assign them.

### apply-changes

Indique if the action must send a request to set the labels in the pull request or, otherwise, it mustn't make any change in the pull request.

You may use `apply-changes` in false to check the next label's status that the pull request should have without any risk.

Allows you to extend the assignment conditions to evaluate the outputs snapshots with additional criteria.

## Outputs

| Output                            | Description                                            |
| :-------------------------------- | :----------------------------------------------------- |
| <nobr>labels-previous</nobr> | List of the labels assigned before the updating        |
| <nobr>labels-assigned</nobr>      | List of the labels added                               |
| <nobr>labels-removed</nobr>       | List of the labels removed                             |
| <nobr>labels-next</nobr>       | List of the labels assigned after the updating         |
| <nobr>action-status</nobr>        | Execution status of the action                         |
| <nobr>action-message</nobr>       | Message associated to the current status of the action |

### Action status

We can use the ```action-status``` and ```action-message``` outputs to check if the action passed or had a problem.

There are many statuses possible. In case of error, the `action-message` contains a description of the error. The status reveals the last operation that `action-assign-labels` was executing before it was interrupted. 

If the ```action-status``` is `END` means the `action-assign-labels` ended correctly.

| action-status                  | description                                                        |
| :----------------------------- | :----------------------------------------------------------------- |
| <nobr>LOAD_DEPENDENCIES</nobr> | Something was wrong when to try inject and initialize dependencies |
| <nobr>LOAD_CONTEXT</nobr>      | Failed to read and parse the GitHub Action context file            |
| <nobr>PARSE_AND_ASSIGN</nobr>  | There was a problem with parsing or assignment labels              |
| <nobr>OUTPUT</nobr>            | Failed the treatment of the outputs                                |
| <nobr>END</nobr>               | The action finished successfully                                   |

## Examples

Here are some common examples:

### Basic use

``` yaml
name: Labels Test

on:
  pull_request:
    branches: [main]
    types:
      [opened, reopened, labeled, unlabeled]

jobs:
  assign-labels:
    runs-on: ubuntu-latest
    name: Assign labels in pull request
    if: github.event.pull_request.merged == false
    steps:
      - uses: actions/checkout@v3

      - uses: mauroalderete/action-assign-labels@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          conventional-commits: |
            conventional-commits:
              - type: 'fix'
                nouns: ['FIX', 'Fix', 'fix', 'FIXED', 'Fixed', 'fixed']
                labels: ['bug']
```

### Extended use

``` yaml
  - name: Execute assign labels
    id: action-assign-labels
    uses: mauroalderete/action-assign-labels@v1
    with:
      pull-request-number: ${{ github.event.pull_request.number }}
      github-token: ${{ secrets.GITHUB_TOKEN }}
      conventional-commits: |
        conventional-commits:
          - type: 'fix'
            nouns: ['FIX', 'Fix', 'fix', 'FIXED', 'Fixed', 'fixed']
            labels: ['bug']
          - type: 'feature'
            nouns: ['FEATURE', 'Feature', 'feature', 'FEAT', 'Feat', 'feat']
            labels: ['feature']
          - type: 'breaking_change'
            nouns: ['BREAKING CHANGE', 'BREAKING', 'MAJOR']
            labels: ['BREAKING CHANGE']
          - type: 'documentation'
            nouns: ['doc','docu','document','documentation']
            labels: ['documentation']
          - type: 'build'
            nouns: ['build','rebuild']
            labels: ['build']
          - type: 'config'
            nouns: ['config', 'conf', 'cofiguration', 'configure']
            labels: ['config']
      maintain-labels-not-matched: false
      apply-changes: true
```

### Without apply and parsing output

``` yaml
  - name: Execute assign labels
    id: action-assign-labels
    uses: mauroalderete/action-assign-labels@v1
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      conventional-commits: |
        conventional-commits:
          - type: 'fix'
            nouns: ['FIX', 'Fix', 'fix', 'FIXED', 'Fixed', 'fixed']
            labels: ['bug']
      apply-changes: false

  - name: Stuff something if PR not contain a fix commit type
    if: ${{ contains(fromJson( steps.action-assign-labels.labels-next ), 'bug') }}
    run:
      ...
  
  - name: Stuff something if label bug was removed
    if: ${{ contains(fromJson( steps.action-assign-labels.labels-removed ), 'bug') }}
    run:
      ...
```

# :hammer: How to Set up `action-assign-labels` for Development?

You set up `action-assign-labels` locally with a few easy steps.

1. Clone the repository

```bash
git clone https://github.com/mauroalderete/action-assign-labels
```

2. Change the working directory

```bash
cd action-assign-labels
```

3. Install dependencies

```bash
npm install
```

4. Install development tools

```bash
curl https://get.volta.sh | bash
export VOLTA_HOME=$HOME/.volta
export PATH=$VOLTA_HOME:$PATH
npm install -g @vercel/ncc
```

For bash, zsh, and fish, the Volta installer updates your console login scripts
so that you won't need to export `VOLTA_HOME` or update `PATH` again.
See [Volta's Getting Started page](https://docs.volta.sh/guide/getting-started)
for more details.

## Scripts

### Lint

```bash
npm run lint
```

### Unit tests

```bash
npm run test
```

### Build

It execute lint and unit tests previously. It makes a distributable version into `/dist` folder.

```bash
npm run build
```

# :wrench: How to work?

The action runs on ubuntu runner as javascript action through node v20.x.

The objective of this project is to provide a scalable project to handle label assignments according to conventional-commits spec. This way can be integrated into most workflow that searches a standard environment development.

To easily maintain, the source is divided into many layers. Use injection dependency pattern to handle the dependencies and simplify the testing.

Each layer joins a series of modules with constructor, class and implementation of uses cases.

This project has the minimum external dependencies:

- [fs](https://www.npmjs.com/package/fs)
- [Jest](https://www.npmjs.com/package/jest)
- [@actions/core](https://www.npmjs.com/package/@actions/core)
- [@octokit/action](https://www.npmjs.com/package/@octokit/action)
- [yamljs](https://www.npmjs.com/package/yamljs)

In some cases, I decided to extract and adapt the single code lines directly from thirty repositories in place of importing all library for a simple feature. In this case, the regexp to identify a noun and scope from the commit message used by
[conventional-commits-parser](https://www.npmjs.com/package/conventional-commits-parser) package.

Unlike the other GitHub Actions, the entry point of `action-assign-labels` contains a unique line code that invokes the main method in the app layer. It allows us to execute tests with the maximum coverage, and improve meanly the maintainability and stability of the solution.

To handle the execution flow it contains a simple pattern to trace the action state.

You can find all source code is documented through [jsdoc](https://jsdoc.app/) convention adapted to [vscode limitations](https://code.visualstudio.com/docs/languages/javascript#_jsdoc-support).

If you have any questions, felt you free to make a comment through a [issue](https://github.com/mauroalderete/action-assign-labels/issues/new/choose).

If you want to improve `action-assign-labels` o simply report a bug, please check the [contributing](#handshake-contributing-to-action-assign-labels) section to know how to do it.

# :shield: License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.

# :handshake: Contributing to `action-assign-labels`

Any kind of positive contribution is welcome! Please help us to grow by contributing to the project.

If you wish to contribute, you can work on any [issue](https://github.com/mauroalderete/action-assign-labels/issues/new/choose) or create one on your own. After adding your code, please send us a Pull Request.

> Please read [`CONTRIBUTING`](CONTRIBUTING.md) for details on our [`CODE OF CONDUCT`](CODE_OF_CONDUCT.md), and the process for submitting pull requests to us.

# :pray: Support

We all need support and motivation. `action-assign-labels` is not an exception. Please give this project a :star: start to encourage and show that you liked it. Don't forget to leave a :star: star before you move away.

If you found the app helpful, consider supporting us with a coffee.

<div align="center">
<a href='https://cafecito.app/mauroalderete' rel='noopener' target='_blank'><img srcset='https://cdn.cafecito.app/imgs/buttons/button_6.png 1x, https://cdn.cafecito.app/imgs/buttons/button_6_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_6_3.75x.png 3.75x' src='https://cdn.cafecito.app/imgs/buttons/button_6.png' alt='Invitame un café en cafecito.app' /></a>
</div>
