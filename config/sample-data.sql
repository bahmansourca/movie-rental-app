USE movie_rental;

-- Insert sample movies
INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer) VALUES
('Teenage Mutant Ninja Turtles', 'Action', 1990, 'English', 'USA', 'Brian Tochi, Corey Feldman', 'Steve Barron', 3, 'path/to/image1.jpg', 'https://youtube.com/watch?v=1'),
('Fast & Furious', 'Action', 2009, 'English', 'USA', 'Vin Diesel, Paul Walker', 'Justin Lin', 2, 'path/to/image2.jpg', 'https://youtube.com/watch?v=2'),
('Hook', 'Adventure', 1991, 'English', 'USA', 'Robin Williams, Dustin Hoffman', 'Steven Spielberg', 1, 'path/to/image3.jpg', 'https://youtube.com/watch?v=3'),
('Sister Act', 'Comedy', 1992, 'English', 'USA', 'Whoopi Goldberg, Maggie Smith', 'Emile Ardolino', 2, 'path/to/image4.jpg', 'https://youtube.com/watch?v=4'),
('Schindlers List', 'Drama', 1993, 'English', 'USA', 'Liam Neeson, Ben Kingsley', 'Steven Spielberg', 1, 'path/to/image5.jpg', 'https://youtube.com/watch?v=5'),
('Twilight', 'Fantasy', 2008, 'English', 'USA', 'Kristen Stewart, Robert Pattinson', 'Catherine Hardwicke', 3, 'path/to/image6.jpg', 'https://youtube.com/watch?v=6'),
('Leon', 'Thriller', 1994, 'English', 'France', 'Jean Reno, Natalie Portman', 'Luc Besson', 2, 'path/to/image7.jpg', 'https://youtube.com/watch?v=7'),
('Pulp Fiction', 'Crime', 1994, 'English', 'USA', 'John Travolta, Samuel L. Jackson', 'Quentin Tarantino', 2, 'path/to/image8.jpg', 'https://youtube.com/watch?v=8'),
('True Lies', 'Action', 1994, 'English', 'USA', 'Arnold Schwarzenegger, Jamie Lee Curtis', 'James Cameron', 1, 'path/to/image9.jpg', 'https://youtube.com/watch?v=9'); 