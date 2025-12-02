import { db } from './db.js';

export const createProduct = async ({ title, description, price, imageUrl, authorId }) => {
    const stmt = db.prepare(`
    INSERT INTO products (title, description, price, image_url, author_id, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);
    const info = await stmt.run(title, description, price, imageUrl, authorId);
    return info.lastInsertRowid;
};

export const getAllProducts = async () => {
    return db.all(`SELECT * FROM products ORDER BY created_at DESC`);
};

export const getProductById = async (id) => {
    return db.get(`SELECT * FROM products WHERE id = ?`, [id]);
};
