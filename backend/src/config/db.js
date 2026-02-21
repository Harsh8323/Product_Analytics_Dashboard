const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool(env.db);

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};