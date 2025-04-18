const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    try {
        // Create connection without database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create database
        await connection.query('CREATE DATABASE IF NOT EXISTS movie_rental');
        console.log('Database created successfully');

        // Close connection and create new one with database
        await connection.end();
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'movie_rental'
        });

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created successfully');

        // Create films table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS films (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                genre VARCHAR(100) NOT NULL,
                annee_sortie INT NOT NULL,
                langue_originale VARCHAR(100) NOT NULL,
                pays_productions VARCHAR(255) NOT NULL,
                acteurs TEXT NOT NULL,
                realisateurs VARCHAR(255) NOT NULL,
                available_copies INT NOT NULL,
                imgPath VARCHAR(255) NOT NULL,
                trailer VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Films table created successfully');

        // Create rentals table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS rentals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                film_id INT NOT NULL,
                rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                return_date TIMESTAMP NULL,
                status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (film_id) REFERENCES films(id)
            )
        `);
        console.log('Rentals table created successfully');

        // Clear existing data
        await connection.query('DELETE FROM rentals');
        console.log('Existing rentals cleared');
        await connection.query('DELETE FROM films');
        console.log('Existing films cleared');

        // Insert sample movies
        const films = [
            {
                title: 'Teenage Mutant Ninja Turtles',
                genre: 'Action',
                annee_sortie: 1990,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Judith Hoag, Elias Koteas',
                realisateurs: 'Steve Barron',
                available_copies: 5,
                imgPath: 'tmnt.jpg',
                trailer: 'https://www.youtube.com/watch?v=1HZzK0QY4N0'
            },
            {
                title: 'Fast & Furious',
                genre: 'Action',
                annee_sortie: 2009,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Vin Diesel, Paul Walker',
                realisateurs: 'Justin Lin',
                available_copies: 3,
                imgPath: 'fastfurious.jpg',
                trailer: 'https://www.youtube.com/watch?v=2TAOizOnNPo'
            },
            {
                title: 'Hook',
                genre: 'Adventure',
                annee_sortie: 1991,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Robin Williams, Dustin Hoffman',
                realisateurs: 'Steven Spielberg',
                available_copies: 4,
                imgPath: 'hook.jpg',
                trailer: 'https://www.youtube.com/watch?v=OqVpqv0kzTA'
            },
            {
                title: 'Sister Act',
                genre: 'Comedy',
                annee_sortie: 1992,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Whoopi Goldberg, Maggie Smith',
                realisateurs: 'Emile Ardolino',
                available_copies: 2,
                imgPath: 'sisteract.jpg',
                trailer: 'https://www.youtube.com/watch?v=QH3Fx41Jpl4'
            },
            {
                title: 'Schindler\'s List',
                genre: 'Drama',
                annee_sortie: 1993,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Liam Neeson, Ben Kingsley',
                realisateurs: 'Steven Spielberg',
                available_copies: 1,
                imgPath: 'schindler.jpg',
                trailer: 'https://www.youtube.com/watch?v=gG22XNhtnoY'
            },
            {
                title: 'Twilight',
                genre: 'Romance',
                annee_sortie: 2008,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Kristen Stewart, Robert Pattinson',
                realisateurs: 'Catherine Hardwicke',
                available_copies: 3,
                imgPath: 'twilight.jpg',
                trailer: 'https://www.youtube.com/watch?v=uxjNDE2fMjI'
            },
            {
                title: 'Léon',
                genre: 'Action',
                annee_sortie: 1994,
                langue_originale: 'French',
                pays_productions: 'France',
                acteurs: 'Jean Reno, Natalie Portman',
                realisateurs: 'Luc Besson',
                available_copies: 2,
                imgPath: 'leon.jpg',
                trailer: 'https://www.youtube.com/watch?v=jawVxq1Iyl0'
            },
            {
                title: 'Pulp Fiction',
                genre: 'Crime',
                annee_sortie: 1994,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'John Travolta, Uma Thurman',
                realisateurs: 'Quentin Tarantino',
                available_copies: 4,
                imgPath: 'pulpfiction.jpg',
                trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY'
            },
            {
                title: 'True Lies',
                genre: 'Action',
                annee_sortie: 1994,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Arnold Schwarzenegger, Jamie Lee Curtis',
                realisateurs: 'James Cameron',
                available_copies: 3,
                imgPath: 'truelies.jpg',
                trailer: 'https://www.youtube.com/watch?v=2Wx1lIe3mFg'
            },
            {
                title: 'Inception',
                genre: 'Sci-Fi',
                annee_sortie: 2010,
                langue_originale: 'English',
                pays_productions: 'USA, UK',
                acteurs: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
                realisateurs: 'Christopher Nolan',
                available_copies: 4,
                imgPath: 'inception.jpg',
                trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
            },
            {
                title: 'The Dark Knight',
                genre: 'Action',
                annee_sortie: 2008,
                langue_originale: 'English',
                pays_productions: 'USA, UK',
                acteurs: 'Christian Bale, Heath Ledger',
                realisateurs: 'Christopher Nolan',
                available_copies: 3,
                imgPath: 'darkknight.jpg',
                trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
            },
            {
                title: 'Gravity',
                genre: 'Sci-Fi',
                annee_sortie: 2013,
                langue_originale: 'English',
                pays_productions: 'USA, UK',
                acteurs: 'Sandra Bullock, George Clooney',
                realisateurs: 'Alfonso Cuarón',
                available_copies: 2,
                imgPath: 'gravity.jpg',
                trailer: 'https://www.youtube.com/watch?v=OiTiKOy59o4'
            },
            {
                title: 'Interstellar',
                genre: 'Sci-Fi',
                annee_sortie: 2014,
                langue_originale: 'English',
                pays_productions: 'USA, UK',
                acteurs: 'Matthew McConaughey, Anne Hathaway',
                realisateurs: 'Christopher Nolan',
                available_copies: 3,
                imgPath: 'interstellar.jpg',
                trailer: 'https://www.youtube.com/watch?v=zSWdZVNyXTg'
            },
            {
                title: 'Avatar',
                genre: 'Sci-Fi',
                annee_sortie: 2009,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Sam Worthington, Zoe Saldana',
                realisateurs: 'James Cameron',
                available_copies: 5,
                imgPath: 'avatar.jpg',
                trailer: 'https://www.youtube.com/watch?v=5VkA0xR6J9M'
            },
            {
                title: 'Le Dîner de Cons',
                genre: 'Comédie',
                annee_sortie: 1998,
                langue_originale: 'Français',
                pays_productions: 'France',
                acteurs: 'Thierry Lhermitte, Jacques Villeret',
                realisateurs: 'Francis Veber',
                available_copies: 3,
                imgPath: 'diner-cons.jpg',
                trailer: 'https://www.youtube.com/watch?v=QH3Fx41Jpl4'
            },
            {
                title: 'Les Visiteurs',
                genre: 'Comédie',
                annee_sortie: 1993,
                langue_originale: 'Français',
                pays_productions: 'France',
                acteurs: 'Jean Reno, Christian Clavier',
                realisateurs: 'Jean-Marie Poiré',
                available_copies: 4,
                imgPath: 'visiteurs.jpg',
                trailer: 'https://www.youtube.com/watch?v=QH3Fx41Jpl4'
            },
            {
                title: 'Forrest Gump',
                genre: 'Drame',
                annee_sortie: 1994,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Tom Hanks, Robin Wright',
                realisateurs: 'Robert Zemeckis',
                available_copies: 3,
                imgPath: 'forrest-gump.jpg',
                trailer: 'https://www.youtube.com/watch?v=bLvqoHBptjg'
            },
            {
                title: 'Le Parrain',
                genre: 'Drame',
                annee_sortie: 1972,
                langue_originale: 'English',
                pays_productions: 'USA',
                acteurs: 'Marlon Brando, Al Pacino',
                realisateurs: 'Francis Ford Coppola',
                available_copies: 2,
                imgPath: 'parrain.jpg',
                trailer: 'https://www.youtube.com/watch?v=sY1S34973zA'
            }
        ];

        // Insert films one by one
        for (const film of films) {
            await connection.query(
                'INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [film.title, film.genre, film.annee_sortie, film.langue_originale, film.pays_productions, film.acteurs, film.realisateurs, film.available_copies, film.imgPath, film.trailer]
            );
            console.log(`Inserted film: ${film.title}`);
        }
        console.log('Sample data inserted successfully');

        console.log('Database initialization completed successfully');
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        if (connection) await connection.end();
        process.exit(1);
    }
}

initializeDatabase(); 