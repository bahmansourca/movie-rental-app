const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const AuthController = require('../controllers/authController');
const FilmController = require('../controllers/filmController');
const UserController = require('../controllers/userController');

// Auth routes
router.post('/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    AuthController.register
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    AuthController.login
);

// Protected routes
router.use(authMiddleware);

// Film routes
router.get('/films', FilmController.getAllFilms);
router.get('/films/search', FilmController.searchFilms);
router.get('/films/:id', FilmController.getFilmById);

router.post('/films/rent', FilmController.rentFilm);
router.post('/films/return', FilmController.returnFilm);
router.get('/my-rentals', FilmController.getMyRentals);

// User routes
router.get('/users/me', UserController.getProfile);
router.get('/users/rental-history', UserController.getRentalHistory);

module.exports = router; 