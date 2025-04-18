const pool = require('../../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create({ name, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, name, email, date_inscription FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User; 