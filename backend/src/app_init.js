const { ensureAdmin } = require('./seed/admin_seed');
async function init() { await ensureAdmin(); }
module.exports = init;
