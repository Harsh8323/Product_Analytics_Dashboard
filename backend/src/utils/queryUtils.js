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
  buildAnalyticsWhereClause,
};