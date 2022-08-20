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
      this.#setInfo(JSON.stringify({
        'action-message': this.#m,
        'action-status': this.#s,
      }));
      return;
    }

    this.#setInfo(JSON.stringify({
      'labels-previous': result['labels-previous'],
      'labels-assigned': result['labels-assigned'],
      'labels-removed': result['labels-removed'],
      'labels-next': result['labels-next'],
      'action-message': this.#m,
      'action-status': this.#s,
    }));
  }

  /**
   * Construct and send to render a summary of the action in markdown.
   * @param {object} result Result of the action.
   */
  summaryAction(result) {
    this.#setSummary.addRaw('# Assign resume', true);

    if (this.#s === 'END' && result) {
      this.#setSummary.addBreak();
      this.#setSummary.addRaw('## Labels affected', true);
      this.#setSummary.addRaw(`**Previous:** ${JSON.stringify(result['labels-previous'])}`, true);
      this.#setSummary.addRaw(`**Added:** ${JSON.stringify(result['labels-added'])}`, true);
      this.#setSummary.addRaw(`**Removed:** ${JSON.stringify(result['labels-removed'])}`, true);
      this.#setSummary.addRaw(`**Next:** ${JSON.stringify(result['labels-next'])}`, true);
    }
    this.#setSummary.addBreak();
    this.#setSummary.addRaw(`## ${this.#s === 'END' ? ':heavy_check_mark:' : ':x:'} Action status`, true);
    this.#setSummary.addRaw(`**Status:** ${this.#s}`, true);
    this.#setSummary.addRaw(`**Message:** ${this.#m}`, true);
  }
}

module.exports = { ActionStatus };
