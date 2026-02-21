const db = require('../config/db');

const createClick = async (userId, featureName) => {
  const query = `
    INSERT INTO feature_clicks (user_id, feature_name, timestamp)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;
  const values = [userId, featureName];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getTotalClicksPerFeature = async (filters) => {
  const { whereClause, values } = buildAnalyticsWhereClause(filters);
  const query = `
    SELECT fc.feature_name, COUNT(*) as count
    FROM feature_clicks fc
    JOIN users u ON fc.user_id = u.id
    ${whereClause ? 'WHERE ' + whereClause : ''}
    GROUP BY fc.feature_name
    ORDER BY fc.feature_name
  `;
  const result = await db.query(query, values);
  return result.rows;
};

const getDailyClicksForFeature = async (feature, filters) => {
  const { whereClause, values } = buildAnalyticsWhereClause(filters, feature);
  const query = `
    SELECT DATE(fc.timestamp) as date, COUNT(*) as count
    FROM feature_clicks fc
    JOIN users u ON fc.user_id = u.id
    ${whereClause ? 'WHERE ' + whereClause : ''}
    GROUP BY DATE(fc.timestamp)
    ORDER BY date
  `;
  const result = await db.query(query, values);
  return result.rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    count: parseInt(row.count, 10)
  }));
};

function buildAnalyticsWhereClause(filters, specificFeature = null) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (filters.startDate) {
    conditions.push(`fc.timestamp >= $${idx++}`);
    values.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push(`fc.timestamp <= $${idx++}`);
    values.push(filters.endDate);
  }
  if (filters.ageGroup) {
    if (filters.ageGroup === '<18') {
      conditions.push(`u.age < $${idx++}`);
      values.push(18);
    } else if (filters.ageGroup === '18-40') {
      conditions.push(`u.age BETWEEN $${idx++} AND $${idx++}`);
      values.push(18, 40);
    } else if (filters.ageGroup === '>40') {
      conditions.push(`u.age > $${idx++}`);
      values.push(40);
    }
  }
  if (filters.gender) {
    conditions.push(`u.gender = $${idx++}`);
    values.push(filters.gender);
  }
  if (specificFeature) {
    conditions.push(`fc.feature_name = $${idx++}`);
    values.push(specificFeature);
  }

  return {
    whereClause: conditions.length ? conditions.join(' AND ') : '',
    values
  };
}

module.exports = {
  createClick,
  getTotalClicksPerFeature,
  getDailyClicksForFeature,
};