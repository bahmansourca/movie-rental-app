const pool = require('../../config/database');

class Film {
    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM films');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM films WHERE id = ?', [id]);
        return rows[0];
    }

    static async search({ title, genre, realisateurs }) {
        let query = 'SELECT * FROM films WHERE 1=1';
        const params = [];

        if (title) {
            query += ' AND title LIKE ?';
            params.push(`%${title}%`);
        }
        if (genre) {
            query += ' AND genre LIKE ?';
            params.push(`%${genre}%`);
        }
        if (realisateurs) {
            query += ' AND realisateurs LIKE ?';
            params.push(`%${realisateurs}%`);
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async updateAvailableCopies(id, change) {
        await pool.execute(
            'UPDATE films SET available_copies = available_copies + ? WHERE id = ?',
            [change, id]
        );
    }

    static async create(filmData) {
        const [result] = await pool.execute(
            'INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                filmData.title,
                filmData.genre,
                filmData.annee_sortie,
                filmData.langue_originale,
                filmData.pays_productions,
                filmData.acteurs,
                filmData.realisateurs,
                filmData.available_copies || 1,
                filmData.imgPath,
                filmData.trailer
            ]
        );
        return result.insertId;
    }
}

module.exports = Film; 