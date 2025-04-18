const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const FilmController = require('../controllers/filmController');
const UserController = require('../controllers/userController');

// Protected routes
router.use(authMiddleware);

// Film routes
router.get('/films', FilmController.findAll);
router.get('/films/:id', FilmController.findById);
router.post('/films/rent', FilmController.rentFilm);
router.post('/films/return', FilmController.returnFilm);

// User routes
router.get('/users/me', UserController.getProfile);
router.get('/users/rentals', UserController.getRentalHistory);

module.exports = router; 