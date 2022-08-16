/* istanbul ignore next */
const app = require('./app/app');

/* istanbul ignore next */
app().then().catch((error) => { throw new Error(`[action-assign-labels] ${error}`); });
