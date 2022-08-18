/**
 * Contains functions to handle request to GitHub API
 * @module src/services/pullrequest.service
 */

/**
 * Construct a {@link PullRequestService `PullRequestService`} to handle request to GitHub API
 * @param {githubAPIClientType} githubClient - A Github client instance.
 * Sends a request based on endpoint options. See {@link githubAPIClientType `githubAPIClientType`}
 * @returns {PullRequestService}
 */
module.exports.makePullRequestService = (githubClient) => {
  /**
   * clase
   * @class
   */
  function PullRequestService() {
    /**
     * Get a pull request payload
     * @param {string} owner - Owner of the repository.
     * @param {string} repository - Repository name.
     * @param {number} pullRequestNumber - Pull request number, it must be positive non zero.
     * @return {Promise<pullRequestPayload>} See {@link pullRequestPayload `pullRequestPayload`}
     */
    this.getPullRequest = async (owner, repository, pullRequestNumber) => {
      const response = await githubClient.request('GET /repos/{owner}/{repository}/pulls/{pullRequestNumber}', {
        owner,
        repository,
        pullRequestNumber,
      });
      if (response.status !== 200) {
        throw new Error(`get pull-request info return ${response.status} status`);
      }
      /**
       * @type pullRequestPayload
       */
      return response.data;
    };

    /**
     * Get a list of the commits payload
     * @async
     * @param {string} owner - Owner of the repository.
     * @param {string} repository - Repository name.
     * @param {number} pullRequestNumber - Pull request number.
     * @returns {commitPayload[]} See {@link commitPayload `commitPayload`}
     */
    this.getCommits = async (owner, repository, pullRequestNumber) => {
      const response = await githubClient.request('GET /repos/{owner}/{repository}/pulls/{pullRequestNumber}/commits', {
        owner,
        repository,
        pullRequestNumber,
      });
      if (response.status !== 200) {
        throw new Error(`get pull-request' commits return ${response.status} status`);
      }
      return response.data;
    };

    /**
     * Assign a list labels in a pull request.
     * @param {string} owner - Owner of the repository.
     * @param {string} repository - Repository name.
     * @param {number} pullRequestNumber - Pull request number.
     * @param {string[]} labels - List of the labels to set in the pull request.
     * @returns {labelPayload[]} See {@link labelPayload `labelPayload`}
     */
    this.setLabels = async (owner, repository, pullRequestNumber, labels) => {
      const response = await githubClient.request('PUT /repos/{owner}/{repository}/issues/{pullRequestNumber}/labels', {
        owner,
        repository,
        pullRequestNumber,
        labels,
      });
      if (response.status !== 200) {
        throw new Error(`set labels failed with ${response.status} status`);
      }
      return response.data;
    };
  }

  return new PullRequestService();
};

/**
 * A Github API client isntance with minimal properties to handle a single REST request.
 * The sign of his property are like {@link https://github.com/octokit Octokit} instance.
 * @typedef githubAPIClientType
 * @property {(route: string, [parameters]: object) => Promise<*>} request
 * Sends a request based on endpoint options
 */

/**
 * @typedef {object} pullRequestPayload
 * @property {string} url
 * @property {number} id
 * @property {string} node_id
 * @property {string} html_url
 * @property {string} diff_url
 * @property {string} patch_url
 * @property {string} issue_url
 * @property {string} commits_url
 * @property {string} review_comments_url
 * @property {string} review_comment_url
 * @property {string} comments_url
 * @property {string} statuses_url
 * @property {number} number
 * @property {string} state
 * @property {boolean} locked
 * @property {string} title
 * @property {object} user
 * @property {string} user.login
 * @property {number} user.id
 * @property {string} user.node_id
 * @property {string} user.avatar_url
 * @property {string} user.gravatar_id
 * @property {string} user.url
 * @property {string} user.html_url
 * @property {string} user.followers_url
 * @property {string} user.following_url
 * @property {string} user.gists_url
 * @property {string} user.starred_url
 * @property {string} user.subscriptions_url
 * @property {string} user.organizations_url
 * @property {string} user.repos_url
 * @property {string} user.events_url
 * @property {string} user.received_events_url
 * @property {string} user.type
 * @property {boolean} user.site_admin
 * @property {string} body
 * @property {object[]} labels
 * @property {number} labels.id
 * @property {string} labels.node_id
 * @property {string} labels.url
 * @property {string} labels.name
 * @property {string} labels.description
 * @property {string} labels.color
 * @property {boolean} labels.default
 * @property {object} milestone
 * @property {string} milestone.url
 * @property {string} milestone.html_url
 * @property {string} milestone.labels_url
 * @property {number} milestone.id
 * @property {string} milestone.node_id
 * @property {number} milestone.number
 * @property {string} milestone.state
 * @property {string} milestone.title
 * @property {string} milestone.description
 * @property {object} milestone.creator
 * @property {string} milestone.creator.login
 * @property {number} milestone.creator.id
 * @property {string} milestone.creator.node_id
 * @property {string} milestone.creator.avatar_url
 * @property {string} milestone.creator.gravatar_id
 * @property {string} milestone.creator.url
 * @property {string} milestone.creator.html_url
 * @property {string} milestone.creator.followers_url
 * @property {string} milestone.creator.following_url
 * @property {string} milestone.creator.gists_url
 * @property {string} milestone.creator.starred_url
 * @property {string} milestone.creator.subscriptions_url
 * @property {string} milestone.creator.organizations_url
 * @property {string} milestone.creator.repos_url
 * @property {string} milestone.creator.events_url
 * @property {string} milestone.creator.received_events_url
 * @property {string} milestone.creator.type
 * @property {boolean} milestone.creator.site_admin
 * @property {number} milestone.open_issues
 * @property {number} milestone.closed_issues
 * @property {string} milestone.created_at
 * @property {string} milestone.updated_at
 * @property {string} milestone.closed_at
 * @property {string} milestone.due_on
 * @property {string} active_lock_reason
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} closed_at
 * @property {string} merged_at
 * @property {string} merge_commit_sha
 * @property {object} assignee
 * @property {string} assignee.login
 * @property {number} assignee.id
 * @property {string} assignee.node_id
 * @property {string} assignee.avatar_url
 * @property {string} assignee.gravatar_id
 * @property {string} assignee.url
 * @property {string} assignee.html_url
 * @property {string} assignee.followers_url
 * @property {string} assignee.following_url
 * @property {string} assignee.gists_url
 * @property {string} assignee.starred_url
 * @property {string} assignee.subscriptions_url
 * @property {string} assignee.organizations_url
 * @property {string} assignee.repos_url
 * @property {string} assignee.events_url
 * @property {string} assignee.received_events_url
 * @property {string} assignee.type
 * @property {boolean} assignee.site_admin
 * @property {object[]|undefined} assignees
 * @property {string} assignees.login
 * @property {number} assignees.id
 * @property {string} assignees.node_id
 * @property {string} assignees.avatar_url
 * @property {string} assignees.gravatar_id
 * @property {string} assignees.url
 * @property {string} assignees.html_url
 * @property {string} assignees.followers_url
 * @property {string} assignees.following_url
 * @property {string} assignees.gists_url
 * @property {string} assignees.starred_url
 * @property {string} assignees.subscriptions_url
 * @property {string} assignees.organizations_url
 * @property {string} assignees.repos_url
 * @property {string} assignees.events_url
 * @property {string} assignees.received_events_url
 * @property {string} assignees.type
 * @property {boolean} assignees.site_admin
 * @property {object[]} requested_reviewers
 * @property {string} requested_reviewers.login
 * @property {number} requested_reviewers.id
 * @property {string} requested_reviewers.node_id
 * @property {string} requested_reviewers.avatar_url
 * @property {string} requested_reviewers.gravatar_id
 * @property {string} requested_reviewers.url
 * @property {string} requested_reviewers.html_url
 * @property {string} requested_reviewers.followers_url
 * @property {string} requested_reviewers.following_url
 * @property {string} requested_reviewers.gists_url
 * @property {string} requested_reviewers.starred_url
 * @property {string} requested_reviewers.subscriptions_url
 * @property {string} requested_reviewers.organizations_url
 * @property {string} requested_reviewers.repos_url
 * @property {string} requested_reviewers.events_url
 * @property {string} requested_reviewers.received_events_url
 * @property {string} requested_reviewers.type
 * @property {boolean} requested_reviewers.site_admin
 * @property {object[]} requested_teams
 * @property {number} requested_teams.id
 * @property {string} requested_teams.node_id
 * @property {string} requested_teams.url
 * @property {string} requested_teams.html_url
 * @property {string} requested_teams.name
 * @property {string} requested_teams.slug
 * @property {string} requested_teams.description
 * @property {string} requested_teams.privacy
 * @property {string} requested_teams.permission
 * @property {string} requested_teams.members_url
 * @property {string} requested_teams.repositories_url
 * @property {object} head
 * @property {string} head.label
 * @property {string} head.ref
 * @property {string} head.sha
 * @property {object} head.user
 * @property {string} head.user.login
 * @property {number} head.user.id
 * @property {string} head.user.node_id
 * @property {string} head.user.avatar_url
 * @property {string} head.user.gravatar_id
 * @property {string} head.user.url
 * @property {string} head.user.html_url
 * @property {string} head.user.followers_url
 * @property {string} head.user.following_url
 * @property {string} head.user.gists_url
 * @property {string} head.user.starred_url
 * @property {string} head.user.subscriptions_url
 * @property {string} head.user.organizations_url
 * @property {string} head.user.repos_url
 * @property {string} head.user.events_url
 * @property {string} head.user.received_events_url
 * @property {string} head.user.type
 * @property {boolean} head.user.site_admin
 * @property {object} head.repo
 * @property {number} head.repo.id
 * @property {string} head.repo.node_id
 * @property {string} head.repo.name
 * @property {string} head.repo.full_name
 * @property {object} head.repo.owner
 * @property {string} head.repo.owner.login
 * @property {number} head.repo.owner.id
 * @property {string} head.repo.owner.node_id
 * @property {string} head.repo.owner.avatar_url
 * @property {string} head.repo.owner.gravatar_id
 * @property {string} head.repo.owner.url
 * @property {string} head.repo.owner.html_url
 * @property {string} head.repo.owner.followers_url
 * @property {string} head.repo.owner.following_url
 * @property {string} head.repo.owner.gists_url
 * @property {string} head.repo.owner.starred_url
 * @property {string} head.repo.owner.subscriptions_url
 * @property {string} head.repo.owner.organizations_url
 * @property {string} head.repo.owner.repos_url
 * @property {string} head.repo.owner.events_url
 * @property {string} head.repo.owner.received_events_url
 * @property {string} head.repo.owner.type
 * @property {boolean} head.repo.owner.site_admin
 * @property {boolean} head.repo.private
 * @property {string} head.repo.html_url
 * @property {string} head.repo.description
 * @property {boolean} head.repo.fork
 * @property {string} head.repo.url
 * @property {string} head.repo.archive_url
 * @property {string} head.repo.assignees_url
 * @property {string} head.repo.blobs_url
 * @property {string} head.repo.branches_url
 * @property {string} head.repo.collaborators_url
 * @property {string} head.repo.comments_url
 * @property {string} head.repo.commits_url
 * @property {string} head.repo.compare_url
 * @property {string} head.repo.contents_url
 * @property {string} head.repo.contributors_url
 * @property {string} head.repo.deployments_url
 * @property {string} head.repo.downloads_url
 * @property {string} head.repo.events_url
 * @property {string} head.repo.forks_url
 * @property {string} head.repo.git_commits_url
 * @property {string} head.repo.git_refs_url
 * @property {string} head.repo.git_tags_url
 * @property {string} head.repo.git_url
 * @property {string} head.repo.issue_comment_url
 * @property {string} head.repo.issue_events_url
 * @property {string} head.repo.issues_url
 * @property {string} head.repo.keys_url
 * @property {string} head.repo.labels_url
 * @property {string} head.repo.languages_url
 * @property {string} head.repo.merges_url
 * @property {string} head.repo.milestones_url
 * @property {string} head.repo.notifications_url
 * @property {string} head.repo.pulls_url
 * @property {string} head.repo.releases_url
 * @property {string} head.repo.ssh_url
 * @property {string} head.repo.stargazers_url
 * @property {string} head.repo.statuses_url
 * @property {string} head.repo.subscribers_url
 * @property {string} head.repo.subscription_url
 * @property {string} head.repo.tags_url
 * @property {string} head.repo.teams_url
 * @property {string} head.repo.trees_url
 * @property {string} head.repo.clone_url
 * @property {string} head.repo.mirror_url
 * @property {string} head.repo.hooks_url
 * @property {string} head.repo.svn_url
 * @property {string} head.repo.homepage
 * @property {object} head.repo.language
 * @property {number} head.repo.forks_count
 * @property {number} head.repo.stargazers_count
 * @property {number} head.repo.watchers_count
 * @property {number} head.repo.size
 * @property {string} head.repo.default_branch
 * @property {number} head.repo.open_issues_count
 * @property {string[]} head.repo.topics
 * @property {boolean} head.repo.has_issues
 * @property {boolean} head.repo.has_projects
 * @property {boolean} head.repo.has_wiki
 * @property {boolean} head.repo.has_pages
 * @property {boolean} head.repo.has_downloads
 * @property {boolean} head.repo.archived
 * @property {boolean} head.repo.disabled
 * @property {string} head.repo.pushed_at
 * @property {string} head.repo.created_at
 * @property {string} head.repo.updated_at
 * @property {object} head.repo.permissions
 * @property {boolean} head.repo.permissions.admin
 * @property {boolean} head.repo.permissions.push
 * @property {boolean} head.repo.permissions.pull
 * @property {boolean} head.repo.allow_rebase_merge
 * @property {string} head.repo.temp_clone_token
 * @property {boolean} head.repo.allow_squash_merge
 * @property {boolean} head.repo.allow_merge_commit
 * @property {boolean} head.repo.allow_forking
 * @property {number} head.repo.forks
 * @property {number} head.repo.open_issues
 * @property {object} head.repo.license
 * @property {string} head.repo.license.key
 * @property {string} head.repo.license.name
 * @property {string} head.repo.license.url
 * @property {string} head.repo.license.spdx_id
 * @property {string} head.repo.license.node_id
 * @property {number} head.repo.watchers
 * @property {object} base
 * @property {string} base.label
 * @property {string} base.ref
 * @property {string} base.sha
 * @property {object} base.user
 * @property {string} base.user.login
 * @property {number} base.user.id
 * @property {string} base.user.node_id
 * @property {string} base.user.avatar_url
 * @property {string} base.user.gravatar_id
 * @property {string} base.user.url
 * @property {string} base.user.html_url
 * @property {string} base.user.followers_url
 * @property {string} base.user.following_url
 * @property {string} base.user.gists_url
 * @property {string} base.user.starred_url
 * @property {string} base.user.subscriptions_url
 * @property {string} base.user.organizations_url
 * @property {string} base.user.repos_url
 * @property {string} base.user.events_url
 * @property {string} base.user.received_events_url
 * @property {string} base.user.type
 * @property {boolean} base.user.site_admin
 * @property {object} base.repo
 * @property {number} base.repo.id
 * @property {string} base.repo.node_id
 * @property {string} base.repo.name
 * @property {string} base.repo.full_name
 * @property {object} base.repo.owner
 * @property {string} base.repo.owner.login
 * @property {number} base.repo.owner.id
 * @property {string} base.repo.owner.node_id
 * @property {string} base.repo.owner.avatar_url
 * @property {string} base.repo.owner.gravatar_id
 * @property {string} base.repo.owner.url
 * @property {string} base.repo.owner.html_url
 * @property {string} base.repo.owner.followers_url
 * @property {string} base.repo.owner.following_url
 * @property {string} base.repo.owner.gists_url
 * @property {string} base.repo.owner.starred_url
 * @property {string} base.repo.owner.subscriptions_url
 * @property {string} base.repo.owner.organizations_url
 * @property {string} base.repo.owner.repos_url
 * @property {string} base.repo.owner.events_url
 * @property {string} base.repo.owner.received_events_url
 * @property {string} base.repo.owner.type
 * @property {boolean} base.repo.owner.site_admin
 * @property {boolean} base.repo.private
 * @property {string} base.repo.html_url
 * @property {string} base.repo.description
 * @property {boolean} base.repo.fork
 * @property {string} base.repo.url
 * @property {string} base.repo.archive_url
 * @property {string} base.repo.assignees_url
 * @property {string} base.repo.blobs_url
 * @property {string} base.repo.branches_url
 * @property {string} base.repo.collaborators_url
 * @property {string} base.repo.comments_url
 * @property {string} base.repo.commits_url
 * @property {string} base.repo.compare_url
 * @property {string} base.repo.contents_url
 * @property {string} base.repo.contributors_url
 * @property {string} base.repo.deployments_url
 * @property {string} base.repo.downloads_url
 * @property {string} base.repo.events_url
 * @property {string} base.repo.forks_url
 * @property {string} base.repo.git_commits_url
 * @property {string} base.repo.git_refs_url
 * @property {string} base.repo.git_tags_url
 * @property {string} base.repo.git_url
 * @property {string} base.repo.issue_comment_url
 * @property {string} base.repo.issue_events_url
 * @property {string} base.repo.issues_url
 * @property {string} base.repo.keys_url
 * @property {string} base.repo.labels_url
 * @property {string} base.repo.languages_url
 * @property {string} base.repo.merges_url
 * @property {string} base.repo.milestones_url
 * @property {string} base.repo.notifications_url
 * @property {string} base.repo.pulls_url
 * @property {string} base.repo.releases_url
 * @property {string} base.repo.ssh_url
 * @property {string} base.repo.stargazers_url
 * @property {string} base.repo.statuses_url
 * @property {string} base.repo.subscribers_url
 * @property {string} base.repo.subscription_url
 * @property {string} base.repo.tags_url
 * @property {string} base.repo.teams_url
 * @property {string} base.repo.trees_url
 * @property {string} base.repo.clone_url
 * @property {string} base.repo.mirror_url
 * @property {string} base.repo.hooks_url
 * @property {string} base.repo.svn_url
 * @property {string} base.repo.homepage
 * @property {object} base.repo.language
 * @property {number} base.repo.forks_count
 * @property {number} base.repo.stargazers_count
 * @property {number} base.repo.watchers_count
 * @property {number} base.repo.size
 * @property {string} base.repo.default_branch
 * @property {number} base.repo.open_issues_count
 * @property {string[]} base.repo.topics
 * @property {boolean} base.repo.has_issues
 * @property {boolean} base.repo.has_projects
 * @property {boolean} base.repo.has_wiki
 * @property {boolean} base.repo.has_pages
 * @property {boolean} base.repo.has_downloads
 * @property {boolean} base.repo.archived
 * @property {boolean} base.repo.disabled
 * @property {string} base.repo.pushed_at
 * @property {string} base.repo.created_at
 * @property {string} base.repo.updated_at
 * @property {object} base.repo.permissions
 * @property {boolean} base.repo.permissions.admin
 * @property {boolean} base.repo.permissions.push
 * @property {boolean} base.repo.permissions.pull
 * @property {boolean} base.repo.allow_rebase_merge
 * @property {string} base.repo.temp_clone_token
 * @property {boolean} base.repo.allow_squash_merge
 * @property {boolean} base.repo.allow_merge_commit
 * @property {number} base.repo.forks
 * @property {number} base.repo.open_issues
 * @property {object} base.repo.license
 * @property {string} base.repo.license.key
 * @property {string} base.repo.license.name
 * @property {string} base.repo.license.url
 * @property {string} base.repo.license.spdx_id
 * @property {string} base.repo.license.node_id
 * @property {number} base.repo.watchers
 * @property {object} _links
 * @property {object} _links.self
 * @property {string} _links.self.href
 * @property {object} _links.html
 * @property {string} _links.html.href
 * @property {object} _links.issue
 * @property {string} _links.issue.href
 * @property {object} _links.comments
 * @property {string} _links.comments.href
 * @property {object} _links.review_comments
 * @property {string} _links.review_comments.href
 * @property {object} _links.review_comment
 * @property {string} _links.review_comment.href
 * @property {object} _links.commits
 * @property {string} _links.commits.href
 * @property {object} _links.statuses
 * @property {string} _links.statuses.href
 * @property {string} author_association
 * @property {object} auto_merge
 * @property {boolean} draft
 * @property {boolean} merged
 * @property {boolean} mergeable
 * @property {boolean|undefined} rebaseable
 * @property {string} mergeable_state
 * @property {object} merged_by
 * @property {string} merged_by.login
 * @property {number} merged_by.id
 * @property {string} merged_by.node_id
 * @property {string} merged_by.avatar_url
 * @property {string} merged_by.gravatar_id
 * @property {string} merged_by.url
 * @property {string} merged_by.html_url
 * @property {string} merged_by.followers_url
 * @property {string} merged_by.following_url
 * @property {string} merged_by.gists_url
 * @property {string} merged_by.starred_url
 * @property {string} merged_by.subscriptions_url
 * @property {string} merged_by.organizations_url
 * @property {string} merged_by.repos_url
 * @property {string} merged_by.events_url
 * @property {string} merged_by.received_events_url
 * @property {string} merged_by.type
 * @property {boolean} merged_by.site_admin
 * @property {number} comments
 * @property {number} review_comments
 * @property {boolean} maintainer_can_modify
 * @property {number} commits
 * @property {number} additions
 * @property {number} deletions
 * @property {number} changed_files
 */

/**
 * @typedef {object} commitPayload
 * @property {string} sha
 * @property {string} node_id
 * @property {object} commit
 * @property {object[]} commit.author
 * @property {object[]} commit.committer
 * @property {string} commit.message
 * @property {object[]} commit.tree
 * @property {string} commit.url
 * @property {number} commit.comment_count
 * @property {object[]} commit.verification
 * @property {string} url
 * @property {string} html_url
 * @property {string} comments_url
 * @property {object} author
 * @property {string} author.login
 * @property {number} author.id
 * @property {string} author.node_id
 * @property {string} author.avatar_url
 * @property {string} author.gravatar_id
 * @property {string} author.url
 * @property {string} author.html_url
 * @property {string} author.followers_url
 * @property {string} author.following_url
 * @property {string} author.gists_url
 * @property {string} author.starred_url
 * @property {string} author.subscriptions_url
 * @property {string} author.organizations_url
 * @property {string} author.repos_url
 * @property {string} author.events_url
 * @property {string} author.received_events_url
 * @property {string} author.type
 * @property {boolean} author.site_admin
 * @property {object} committer
 * @property {string} committer.login
 * @property {number} committer.id
 * @property {string} committer.node_id
 * @property {string} committer.avatar_url
 * @property {string} committer.gravatar_id
 * @property {string} committer.url
 * @property {string} committer.html_url
 * @property {string} committer.followers_url
 * @property {string} committer.following_url
 * @property {string} committer.gists_url
 * @property {string} committer.starred_url
 * @property {string} committer.subscriptions_url
 * @property {string} committer.organizations_url
 * @property {string} committer.repos_url
 * @property {string} committer.events_url
 * @property {string} committer.received_events_url
 * @property {string} committer.type
 * @property {boolean} committer.site_admin
 * @property {array[]|object[]} parents
 */

/**
 * @typedef {object} labelPayload
 * @property {number} id
 * @property {string} node_id
 * @property {string} url
 * @property {string} name
 * @property {string} description
 * @property {string} color
 * @property {boolean} default
 */
