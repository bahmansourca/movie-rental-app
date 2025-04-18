const Film = require('../models/filmModel');
const Rental = require('../models/rentalModel');
const pool = require('../../config/database');

class FilmController {
    static async getAllFilms(req, res) {
        try {
            const films = await Film.findAll();
            res.json(films);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching films' });
        }
    }

    static async getFilmById(req, res) {
        try {
            const film = await Film.findById(req.params.id);
            if (!film) {
                return res.status(404).json({ message: 'Film not found' });
            }
            res.json(film);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching film' });
        }
    }

    static async searchFilms(req, res) {
        try {
            const { title, genre, year } = req.query;
            let query = 'SELECT * FROM films WHERE 1=1';
            const params = [];

            if (title) {
                query += ' AND title LIKE ?';
                params.push(`%${title}%`);
            }
            if (genre) {
                query += ' AND genre = ?';
                params.push(genre);
            }
            if (year) {
                query += ' AND annee_sortie = ?';
                params.push(year);
            }

            const [rows] = await pool.execute(query, params);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error searching films' });
        }
    }

    static async rentFilm(req, res) {
        try {
            const { film_id } = req.body;
            const user_id = req.user.id;

            // Check if user has reached rental limit
            const activeRentals = await Rental.countActiveRentals(user_id);
            if (activeRentals >= 5) {
                return res.status(400).json({ message: 'Maximum rental limit reached' });
            }

            // Check if film is already rented by user
            const isRented = await Rental.isFilmRentedByUser(user_id, film_id);
            if (isRented) {
                return res.status(400).json({ message: 'Film already rented' });
            }

            // Check if film is available
            const film = await Film.findById(film_id);
            if (!film || film.available_copies <= 0) {
                return res.status(400).json({ message: 'Film not available' });
            }

            // Create rental and update available copies
            await Rental.create({ user_id, film_id });
            await Film.updateAvailableCopies(film_id, -1);

            res.json({ message: 'Film rented successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error renting film' });
        }
    }

    static async returnFilm(req, res) {
        try {
            const { rental_id } = req.body;
            const user_id = req.user.id;

            // Get rental details
            const [rental] = await pool.execute(
                `SELECT r.*, f.id as film_id 
                 FROM rentals r 
                 JOIN films f ON r.film_id = f.id 
                 WHERE r.id = ? AND r.user_id = ?`,
                [rental_id, user_id]
            );

            if (!rental || rental.length === 0) {
                return res.status(404).json({ message: 'Location non trouvée' });
            }

            // Return film and update available copies
            await Rental.returnRental(rental_id);
            await Film.updateAvailableCopies(rental[0].film_id, 1);

            res.json({ message: 'Film retourné avec succès' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors du retour du film' });
        }
    }

    static async getMyRentals(req, res) {
        try {
            const rentals = await Rental.findByUserId(req.user.id);
            res.json(rentals);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching rentals' });
        }
    }
}

module.exports = FilmController; 