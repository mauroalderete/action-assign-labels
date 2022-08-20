/* eslint-disable no-unused-vars */
const core = require('@actions/core');
const { ActionStatus } = require('./action-status');

let output = '';
let info = '';

const EOL = '\n';

class Summary {
  constructor() {
    this.buffer = '';
    this.written = '';
  }

  clear() {
    this.buffer = '';
    this.written = '';
  }

  addRaw(text, eol) {
    this.buffer = `${this.buffer}${text}${eol === true ? EOL : ''}`;
    return this;
  }

  addBreak() {
    this.buffer = `${this.buffer}<br>${EOL}`;
    return this;
  }

  write(options) {
    this.written = this.buffer;
    if (options && options.overwrite) {
      this.buffer = '';
    }
  }
}

const summaryMock = new Summary();

jest.spyOn(core, 'setOutput').mockImplementation((name, value) => { output = `${name}${value}`; });
jest.spyOn(core.summary, 'addRaw').mockImplementation((text, eol) => summaryMock.addRaw(text, eol));
jest.spyOn(core.summary, 'addBreak').mockImplementation(() => summaryMock.addBreak());
jest.spyOn(core.summary, 'write').mockImplementation((options) => summaryMock.write(options));
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

      expect(info).toBe(`summary: ${JSON.stringify({
        'action-message': 'error',
        'action-status': 'some status',
      })}`);
    });

    it('wihtout error', () => {
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'END';

      const result = {
        'labels-previous': ['a'],
        'labels-assigned': ['b', 'b'],
        'labels-removed': [],
        'labels-next': ['c'],
      };

      actionStatus.summaryConsole(result);

      expect(info).toBe(`summary: ${JSON.stringify({
        'labels-previous': result['labels-previous'],
        'labels-assigned': result['labels-assigned'],
        'labels-removed': result['labels-removed'],
        'labels-next': result['labels-next'],
        'action-message': '',
        'action-status': 'END',
      })}`);
    });
  });

  describe('action summary', () => {
    it('with error', () => {
      summaryMock.clear();
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'some status';
      actionStatus.message = 'error';
      actionStatus.summaryAction();

      expect(summaryMock.written).toBe(`# Assign resume<br>
## :x: Action status<br>
**Status:** ${actionStatus.status}<br>
**Message:** ${actionStatus.message}`);
    });

    it('without error', () => {
      summaryMock.clear();
      const actionStatus = new ActionStatus(core.setOutput, core.info, core.summary);
      actionStatus.status = 'END';

      const result = {
        'labels-previous': ['a'],
        'labels-assigned': ['b', 'b'],
        'labels-removed': [],
        'labels-next': ['c'],
      };

      actionStatus.summaryAction(result);

      expect(summaryMock.written).toBe(`# Assign resume<br>
## Labels affected<br>
**Previous:** ${JSON.stringify(result['labels-previous'])}<br>
**Assigned:** ${JSON.stringify(result['labels-assigned'])}<br>
**Removed:** ${JSON.stringify(result['labels-removed'])}<br>
**Next:** ${JSON.stringify(result['labels-next'])}<br>
## :heavy_check_mark: Action status<br>
**Status:** ${actionStatus.status}<br>
**Message:** ${actionStatus.message}`);
    });
  });
});
