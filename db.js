const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'OePAFTNOCbMMvdhSEXmvNTzJdHgPVIjA',
  host: 'switchback.proxy.rlwy.net',
  port: 41615,
  database: 'railway'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};