import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',       // ganti dengan user DB kamu
  host: 'localhost',
  database: 'todo_app',   // ganti dengan nama DB kamu
  password: 'root',
  port: 5432,
});

export default pool;
