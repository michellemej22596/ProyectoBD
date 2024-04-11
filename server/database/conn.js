// conn.js
import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'restaurantDB',
  password: '',
  port: 5432,
});

export default pool;
