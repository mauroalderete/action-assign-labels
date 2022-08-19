/**
 * The index is the action's entry point.
 * Only contains a single call to the [app module]{@link module:src/app/app} to start the action.
 *
 * This extra layer before running the action's core allows
 * separating the entry point to the production of the rest of all modules
 * when are used to run tests.
 * In this way doesn't need to make any specific environment or
 * environment variables or another approach
 * that will affect the user requirements and experiences.
 * @module src/index
 */

/* istanbul ignore next */
const app = require('./app/app');

/* istanbul ignore next */
app().then().catch((error) => { throw new Error(`[action-assign-labels] ${error}`); });
