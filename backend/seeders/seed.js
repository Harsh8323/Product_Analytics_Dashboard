require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../src/config/db');

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysAgo = 30) => {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

const genders = ['Male', 'Female', 'Other'];
const featureNames = ['date_filter', 'age_filter', 'gender_filter', 'bar_chart_zoom', 'line_chart_click'];

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('Seeding database...');

    await client.query('DROP TABLE IF EXISTS feature_clicks');
    await client.query('DROP TABLE IF EXISTS users');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other'))
      )
    `);

    await client.query(`
      CREATE TABLE feature_clicks (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        feature_name VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const userCount = rand(10, 20);
    const userIds = [];

    for (let i = 0; i < userCount; i++) {
      const username = `user${i + 1}_${rand(100, 999)}`;
      const password = await bcrypt.hash('password123', 10);
      const age = rand(13, 70);
      const gender = genders[Math.floor(Math.random() * genders.length)];

      const res = await client.query(
        'INSERT INTO users (username, password, age, gender) VALUES ($1, $2, $3, $4) RETURNING id',
        [username, password, age, gender]
      );
      userIds.push(res.rows[0].id);
    }

    console.log(`Created ${userIds.length} users`);

    const clickCount = rand(100, 300);
    for (let i = 0; i < clickCount; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const feature = featureNames[Math.floor(Math.random() * featureNames.length)];
      const timestamp = randomDate(30);

      await client.query(
        'INSERT INTO feature_clicks (user_id, feature_name, timestamp) VALUES ($1, $2, $3)',
        [userId, feature, timestamp]
      );
    }

    console.log(`Created ${clickCount} feature clicks`);
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();