import { Pool, QueryResult } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const host = process.env.DATABASE_URL || 'localhost';
  const port = parseInt(process.env.DATABASE_PORT || '5432');
  const user = process.env.DATABASE_USERNAME || 'postgres';
  const password = process.env.DATABASE_PASSWORD || '';
  const database = process.env.DATABASE_NAME || 'ops_bookmark';

  pool = new Pool({
    host,
    port,
    user,
    password,
    database,
  });

  return pool;
}

export async function initializeDatabase() {
  const client = await getPool().connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

export async function createUser(username: string, password: string, role: string) {
  const client = await getPool().connect();
  
  try {
    await client.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, password, role]
    );
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') {
      return { success: false, error: 'Username already exists. Please choose another username.' };
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByUsername(username: string) {
  const client = await getPool().connect();
  
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
