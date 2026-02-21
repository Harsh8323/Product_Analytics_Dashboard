const db = require('../config/db');

const createUser = async (username, hashedPassword, age, gender) => {
  const query = `
    INSERT INTO users (username, password, age, gender)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, age, gender
  `;
  const values = [username, hashedPassword, age, gender];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await db.query(query, [username]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = 'SELECT id, username, age, gender FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};