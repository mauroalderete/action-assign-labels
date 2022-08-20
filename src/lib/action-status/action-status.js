/**
 * Contains artifacts to handle the action status and the summary generation
  * @module src/lib/action-status
 */

/**
 * Store the current status of the action and allow generate a summary of the state.
 * @class ActionStatus
 */
class ActionStatus {
  #setOutput;

  #setInfo;

  #setSummary;

  #s;

  #m;

  /**
   * Constructor
   * @param {(name, value) => void} setOutput Callback to the handler outputs.
   * @param {(message) => void} setInfo Callback to the printer console message.
   * @param {(object)} setSummary Instance the summary engine.
   */
  constructor(setOutput, setInfo, setSummary) {
    this.#setOutput = setOutput;
    this.#setInfo = setInfo;
    this.#setSummary = setSummary;
    this.#s = '';
    this.#m = '';
  }

  get status() {
    return this.#s;
  }

  set status(status) {
    this.#s = status;
    this.#setOutput('action-status', this.#s);
  }

  get message() {
    return this.#m;
  }

  set message(message) {
    this.#m = message;
    this.#setOutput('action-message', this.#m);
  }

  /**
   * Construct a summary to showing in console
   * @param {object} result Result of the action
   */
  summaryConsole(result) {
    if (!result) {
      this.#setInfo(`summary: ${JSON.stringify({
        'action-message': this.#m,
        'action-status': this.#s,
      })}`);
      return;
    }

    this.#setInfo(`summary: ${JSON.stringify({
      'labels-previous': result['labels-previous'],
      'labels-assigned': result['labels-assigned'],
      'labels-removed': result['labels-removed'],
      'labels-next': result['labels-next'],
      'action-message': this.#m,
      'action-status': this.#s,
    })}`);
  }

  /**
   * Construct and send to render a summary of the action in markdown.
   * @param {object} result Result of the action.
   */
  summaryAction(result) {
    this.#setSummary.addRaw('# Assign resume').addBreak();

    if (this.#s === 'END' && result) {
      this.#setSummary.addRaw('## Labels affected')
        .addBreak()
        .addRaw(`**Previous:** ${JSON.stringify(result['labels-previous'])}`)
        .addBreak()
        .addRaw(`**Assigned:** ${JSON.stringify(result['labels-assigned'])}`)
        .addBreak()
        .addRaw(`**Removed:** ${JSON.stringify(result['labels-removed'])}`)
        .addBreak()
        .addRaw(`**Next:** ${JSON.stringify(result['labels-next'])}`)
        .addBreak();
    }

    this.#setSummary.addRaw(`## ${this.#s === 'END' ? ':heavy_check_mark:' : ':x:'} Action status`)
      .addBreak()
      .addRaw(`**Status:** ${this.#s}`)
      .addBreak()
      .addRaw(`**Message:** ${this.#m}`)
      .write({ overwrite: true });
  }
}

module.exports = { ActionStatus };
