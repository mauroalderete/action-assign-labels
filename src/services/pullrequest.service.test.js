/* eslint-disable no-unused-vars */
const PullrequestService = require('./pullrequest.service');
const { octokitPullrequestSuccessfullMock, octokitRequestFailMock, octokitCommitsSuccessfullMock } = require('../__mock__/octokit.mock');

describe('PullrequestService', () => {
  describe('instance', () => {
    it('construct without client', () => {
      expect(() => {
        const service = new PullrequestService();
      }).toThrow();
    });

    it('construct with client', () => {
      expect(() => {
        const service = new PullrequestService({});
      }).not.toThrow();
    });
  });

  describe('get pull request', () => {
    const service = new PullrequestService(octokitPullrequestSuccessfullMock);
    it('validate owner', () => {
      expect(async () => {
        await service.getPullrequest(null, 'repo', 13);
      }).rejects.toThrow();
      expect(async () => {
        await service.getPullrequest(undefined, 'repo', 13);
      }).rejects.toThrow();
    });

    it('validate repo', () => {
      expect(async () => {
        await service.getPullrequest('owner', null, 13);
      }).rejects.toThrow();
      expect(async () => {
        await service.getPullrequest('owner', undefined, 13);
      }).rejects.toThrow();
    });

    it('validate pullNumber', () => {
      expect(async () => {
        await service.getPullrequest('owner', 'repo');
      }).rejects.toThrow();
      expect(async () => {
        await service.getPullrequest('owner', 'repo', null);
      }).rejects.toThrow();
      expect(async () => {
        await service.getPullrequest('owner', 'repo', undefined);
      }).rejects.toThrow();
    });

    it('request with status === 200', async () => {
      const data = await service.getPullrequest('owner', 'repo', 13);
      expect(data).toHaveProperty('id');
    });

    it('request with status !== 200', () => {
      expect(async () => {
        const serviceFail = new PullrequestService(octokitRequestFailMock);
        await serviceFail.getPullrequest('owner', 'repo', 13);
      }).rejects.toThrow();
    });
  });

  describe('get commits from pull request', () => {
    const service = new PullrequestService(octokitCommitsSuccessfullMock);
    it('validate owner', () => {
      expect(async () => {
        await service.getCommits(null, 'repo', 13);
      }).rejects.toThrow();
      expect(async () => {
        await service.getCommits(undefined, 'repo', 13);
      }).rejects.toThrow();
    });

    it('validate repo', () => {
      expect(async () => {
        await service.getCommits('owner', null, 13);
      }).rejects.toThrow();
      expect(async () => {
        await service.getCommits('owner', undefined, 13);
      }).rejects.toThrow();
    });

    it('validate pullNumber', () => {
      expect(async () => {
        await service.getCommits('owner', 'repo');
      }).rejects.toThrow();
      expect(async () => {
        await service.getCommits('owner', 'repo', null);
      }).rejects.toThrow();
      expect(async () => {
        await service.getCommits('owner', 'repo', undefined);
      }).rejects.toThrow();
    });

    it('request with status === 200', async () => {
      const data = await service.getCommits('owner', 'repo', 13);
      expect(data[0]).toHaveProperty('sha');
    });

    it('request with status !== 200', () => {
      expect(async () => {
        const serviceFail = new PullrequestService(octokitRequestFailMock);
        await serviceFail.getCommits('owner', 'repo', 13);
      }).rejects.toThrow();
    });
  });
});
