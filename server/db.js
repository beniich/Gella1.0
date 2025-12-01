import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'gella.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
    // Users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      credits INTEGER DEFAULT 110,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Designs table
    db.exec(`
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

    console.log('✓ Database tables created/verified');
};

// Initialize tables
createTables();

// User methods
export const createUser = (username, email, passwordHash) => {
    const stmt = db.prepare(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = stmt.run(username, email, passwordHash);
    return result.lastInsertRowid;
};

export const findUserByEmail = (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
};

export const findUserById = (id) => {
    const stmt = db.prepare('SELECT id, username, email, credits, created_at FROM users WHERE id = ?');
    return stmt.get(id);
};

export const updateUserCredits = (userId, credits) => {
    const stmt = db.prepare('UPDATE users SET credits = ? WHERE id = ?');
    stmt.run(credits, userId);
};

export const getUserCredits = (userId) => {
    const stmt = db.prepare('SELECT credits FROM users WHERE id = ?');
    const result = stmt.get(userId);
    return result ? result.credits : null;
};

// Design methods
export const createDesign = (userId, prompt, imageUrl, explanation) => {
    const stmt = db.prepare(
        'INSERT INTO designs (user_id, prompt, image_url, explanation) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, prompt, imageUrl, explanation);
    return result.lastInsertRowid;
};

export const getUserDesigns = (userId) => {
    const stmt = db.prepare('SELECT * FROM designs WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
};

export const getDesignById = (designId) => {
    const stmt = db.prepare('SELECT * FROM designs WHERE id = ?');
    return stmt.get(designId);
};

export const updateDesign = (designId, prompt, imageUrl, explanation) => {
    const stmt = db.prepare(
        'UPDATE designs SET prompt = ?, image_url = ?, explanation = ? WHERE id = ?'
    );
    stmt.run(prompt, imageUrl, explanation, designId);
};

export const deleteDesign = (designId) => {
    const stmt = db.prepare('DELETE FROM designs WHERE id = ?');
    stmt.run(designId);
};

export default db;
