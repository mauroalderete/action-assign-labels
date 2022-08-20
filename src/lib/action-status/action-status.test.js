/* eslint-disable no-unused-vars */
const core = require('@actions/core');
const { ActionStatus } = require('./action-status');

let output = '';
let raw = '';
const br = '';
let info = '';

const EOL = '\n';

jest.spyOn(core, 'setOutput').mockImplementation((name, value) => { output = `${name}${value}`; });
jest.spyOn(core.summary, 'addRaw').mockImplementation((text, eol) => { raw = `${raw}${text}${eol === true ? EOL : ''}`; });
jest.spyOn(core.summary, 'addBreak').mockImplementation(() => { raw = `${raw}<br>${EOL}`; });
jest.spyOn(core, 'info').mockImplementation((message) => { info = `${message}`; });

describe('action-status', () => {
  describe('status', () => {
    it('single assign status', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'SOME_STATUS';
      expect(actionStatus.status).toBe('SOME_STATUS');
    });

    it('update status', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'SOME_STATUS';
      actionStatus.status = 'SOME_STATUS_2';
      expect(actionStatus.status).toBe('SOME_STATUS_2');
    });
  });

  describe('message', () => {
    it('single assign fail', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.message = 'some fail';
      expect(actionStatus.message).toBe('some fail');
    });

    it('update fail', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.message = 'some fail';
      actionStatus.message = 'more errors';
      expect(actionStatus.message).toBe('more errors');
    });
  });

  describe('console summary', () => {
    it('with error', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'some status';
      actionStatus.message = 'error';
      actionStatus.summaryConsole();

      expect(info).toBe(JSON.stringify({
        'action-message': 'error',
        'action-status': 'some status',
      }));
    });

    it('wihtout error', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'END';

      const result = {
        'labels-previous': ['a'],
        'labels-added': ['b', 'b'],
        'labels-removed': [],
        'labels-next': ['c'],
      };

      actionStatus.summaryConsole(result);

      expect(info).toBe(JSON.stringify({
        'labels-previous': result['labels-previous'],
        'labels-assigned': result['labels-assigned'],
        'labels-removed': result['labels-removed'],
        'labels-next': result['labels-next'],
        'action-message': '',
        'action-status': 'END',
      }));
    });
  });

  describe('action summary', () => {
    it('with error', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'some status';
      actionStatus.message = 'error';
      actionStatus.summaryAction();

      expect(raw).toBe(`# Assign resume
<br>
## :x: Action status
**Status:** ${actionStatus.status}
**Message:** ${actionStatus.message}
`);
    });

    it('without error', () => {
      raw = '';
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'END';

      const result = {
        'labels-previous': ['a'],
        'labels-added': ['b', 'b'],
        'labels-removed': [],
        'labels-next': ['c'],
      };

      actionStatus.summaryAction(result);

      expect(raw).toBe(`# Assign resume
<br>
## Labels affected
**Previous:** ${JSON.stringify(result['labels-previous'])}
**Added:** ${JSON.stringify(result['labels-added'])}
**Removed:** ${JSON.stringify(result['labels-removed'])}
**Next:** ${JSON.stringify(result['labels-next'])}
<br>
## :heavy_check_mark: Action status
**Status:** ${actionStatus.status}
**Message:** ${actionStatus.message}
`);
    });
  });
});
