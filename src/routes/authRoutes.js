const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// Route d'inscription
router.post('/register', 
    [
        body('name').trim().notEmpty().withMessage('Le nom est requis'),
        body('email').trim().isEmail().withMessage('Email invalide'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    ],
    authController.register
);

// Route de connexion
router.post('/login', 
    [
        body('email').trim().isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Le mot de passe est requis')
    ],
    authController.login
);

module.exports = router; 