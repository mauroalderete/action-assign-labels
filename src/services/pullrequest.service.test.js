/* eslint-disable no-unused-vars */
const { makePullRequestService } = require('./pullrequest.service');
const {
  octokitPullrequestSuccessfullMock,
  octokitRequestFailMock,
  octokitCommitsSuccessfullMock,
  octokitSetLabelsSuccessfullMock,
} = require('../__mocks__/octokit.mock');

describe('PullrequestService', () => {
  describe('get pull request', () => {
    it('request with status === 200', async () => {
      const service = makePullRequestService(octokitPullrequestSuccessfullMock);
      const data = await service.getPullRequest('owner', 'repo', 13);
      expect(data).toHaveProperty('id');
    });

    it('request with status !== 200', () => {
      expect(async () => {
        const serviceFail = makePullRequestService(octokitRequestFailMock);
        await serviceFail.getPullRequest('owner', 'repo', 13);
      }).rejects.toThrow();
    });
  });

  describe('get commits from pull request', () => {
    it('request with status === 200', async () => {
      const service = makePullRequestService(octokitCommitsSuccessfullMock);
      const data = await service.getCommits('owner', 'repo', 13);
      expect(data[0]).toHaveProperty('sha');
    });

    it('request with status !== 200', () => {
      expect(async () => {
        const serviceFail = makePullRequestService(octokitRequestFailMock);
        await serviceFail.getCommits('owner', 'repo', 13);
      }).rejects.toThrow();
    });
  });

  describe('set labels to pull request', () => {
    it('request with status === 200', async () => {
      const service = makePullRequestService(octokitSetLabelsSuccessfullMock);
      const data = await service.setLabels('owner', 'repo', 13, ['bug', 'enhancement']);
      expect(data[0]).toHaveProperty('name', 'bug');
      expect(data[1]).toHaveProperty('name', 'enhancement');
    });

    it('request with status !== 200', () => {
      expect(async () => {
        const serviceFail = makePullRequestService(octokitRequestFailMock);
        await serviceFail.setLabels('owner', 'repo', 13, ['bug', 'enhancement']);
      }).rejects.toThrow();
    });
  });
});
