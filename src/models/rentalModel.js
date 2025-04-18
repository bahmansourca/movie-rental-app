const pool = require('../../config/database');

class Rental {
    static async create({ user_id, film_id }) {
        const [result] = await pool.execute(
            'INSERT INTO rentals (user_id, film_id) VALUES (?, ?)',
            [user_id, film_id]
        );
        return result.insertId;
    }

    static async findByUserId(user_id) {
        const [rows] = await pool.execute(
            `SELECT 
                r.id,
                r.rental_date,
                r.return_date,
                f.id as film_id,
                f.title,
                f.imgPath,
                f.genre,
                f.annee_sortie,
                f.trailer,
                CASE 
                    WHEN r.return_date IS NULL THEN 'active'
                    ELSE 'returned'
                END as status
             FROM rentals r 
             JOIN films f ON r.film_id = f.id 
             WHERE r.user_id = ? 
             ORDER BY r.rental_date DESC`,
            [user_id]
        );
        
        // Restructurer les données pour correspondre à l'attente du frontend
        return rows.map(row => ({
            id: row.id,
            rental_date: row.rental_date,
            return_date: row.return_date,
            status: row.status,
            film: {
                id: row.film_id,
                title: row.title,
                imgPath: row.imgPath,
                genre: row.genre,
                annee_sortie: row.annee_sortie,
                trailer: row.trailer
            }
        }));
    }

    static async returnRental(rental_id) {
        await pool.execute(
            'UPDATE rentals SET return_date = CURRENT_TIMESTAMP WHERE id = ?',
            [rental_id]
        );
    }

    static async countActiveRentals(user_id) {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM rentals WHERE user_id = ? AND return_date IS NULL',
            [user_id]
        );
        return rows[0].count;
    }

    static async isFilmRentedByUser(user_id, film_id) {
        const [rows] = await pool.execute(
            'SELECT * FROM rentals WHERE user_id = ? AND film_id = ? AND return_date IS NULL',
            [user_id, film_id]
        );
        return rows.length > 0;
    }
}

module.exports = Rental; 