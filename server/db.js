import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
let db;

(async () => {
    db = await open({
        filename: path.join(__dirname, 'gella.db'),
        driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Create tables
    await createTables();
})();

// Create tables
const createTables = async () => {
    // Users table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      credits INTEGER DEFAULT 110,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Add role column if it doesn't exist (for existing dbs)
    try {
        await db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`);
    } catch (e) {
        // Column likely exists, ignore
    }

    // Designs table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      image_url TEXT,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

    // Products table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      author_id INTEGER,
      created_at TEXT,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

    console.log('✓ Database tables created/verified');
};

// Initialize tables


// User methods
export const createUser = async (username, email, passwordHash) => {
    const result = await db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash]
    );
    return result.lastID;
};

export const findUserByEmail = async (email) => {
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
};

export const findUserById = async (id) => {
    return await db.get('SELECT id, username, email, credits, role, created_at FROM users WHERE id = ?', [id]);
};

export const updateUserCredits = async (userId, credits) => {
    await db.run('UPDATE users SET credits = ? WHERE id = ?', [credits, userId]);
};

export const getUserCredits = async (userId) => {
    const result = await db.get('SELECT credits FROM users WHERE id = ?', [userId]);
    return result ? result.credits : null;
};

// Design methods
export const createDesign = async (userId, prompt, imageUrl, explanation) => {
    const result = await db.run(
        'INSERT INTO designs (user_id, prompt, image_url, explanation) VALUES (?, ?, ?, ?)',
        [userId, prompt, imageUrl, explanation]
    );
    return result.lastID;
};

export const getUserDesigns = async (userId) => {
    return await db.all('SELECT * FROM designs WHERE user_id = ? ORDER BY created_at DESC', [userId]);
};

export const getDesignById = async (designId) => {
    return await db.get('SELECT * FROM designs WHERE id = ?', [designId]);
};

export const updateDesign = async (designId, prompt, imageUrl, explanation) => {
    await db.run(
        'UPDATE designs SET prompt = ?, image_url = ?, explanation = ? WHERE id = ?',
        [prompt, imageUrl, explanation, designId]
    );
};

export const deleteDesign = async (designId) => {
    await db.run('DELETE FROM designs WHERE id = ?', [designId]);
};

export { db };
