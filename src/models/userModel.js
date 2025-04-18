const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create({ name, email, password }) {
        const query = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            RETURNING id
        `;
        const [result] = await db.query(query, [name, email, password]);
        return result.id;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User; 