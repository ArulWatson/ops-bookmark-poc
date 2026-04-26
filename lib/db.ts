import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_URL || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
});

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
}

export async function createUser(username: string, password: string, role: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Username already exists');
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByUsername(username: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function verifyCredentials(username: string, password: string) {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  if (user.password === password) {
    return { id: user.id, username: user.username, role: user.role };
  }
  return null;
}
