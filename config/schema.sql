-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    date_inscription DATE DEFAULT (CURRENT_DATE)
);

-- Films table
CREATE TABLE IF NOT EXISTS films (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    annee_sortie YEAR NOT NULL,
    langue_originale VARCHAR(100) NOT NULL,
    pays_productions VARCHAR(255) NOT NULL,
    acteurs TEXT NOT NULL,
    realisateurs VARCHAR(255) NOT NULL,
    available_copies INT NOT NULL DEFAULT 1,
    imgPath VARCHAR(500),
    trailer VARCHAR(500)
);

-- Rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    film_id INT NOT NULL,
    rental_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (film_id) REFERENCES films(id)
); 