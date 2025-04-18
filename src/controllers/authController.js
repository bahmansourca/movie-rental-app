const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

class AuthController {
    static async register(req, res) {
        console.log('Début de l\'inscription avec:', req.body);
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Erreurs de validation:', errors.array());
                return res.status(400).json({ 
                    message: 'Données invalides',
                    errors: errors.array() 
                });
            }

            const { name, email, password } = req.body;
            console.log('Données reçues:', { name, email, password: '***' });

            // Vérification des données
            if (!name || !email || !password) {
                console.log('Champs manquants:', { name: !!name, email: !!email, password: !!password });
                return res.status(400).json({ 
                    message: 'Tous les champs sont requis' 
                });
            }

            // Check if user already exists
            console.log('Vérification de l\'existence de l\'utilisateur...');
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                console.log('Email déjà utilisé:', email);
                return res.status(400).json({ 
                    message: 'Cet email est déjà utilisé' 
                });
            }

            // Hash the password
            console.log('Hachage du mot de passe...');
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            console.log('Création de l\'utilisateur...');
            const userId = await User.create({
                name,
                email,
                password: hashedPassword
            });
            
            console.log('Utilisateur créé avec l\'ID:', userId);
            
            // Generate JWT token
            const token = jwt.sign(
                { userId },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            console.log('Inscription réussie pour l\'utilisateur:', email);
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token
            });
        } catch (error) {
            console.error('Erreur détaillée lors de l\'inscription:', error);
            res.status(500).json({ 
                message: 'Une erreur est survenue lors de l\'inscription',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    static async login(req, res) {
        console.log('Tentative de connexion avec:', { email: req.body.email, password: '***' });
        
        try {
            const { email, password } = req.body;

            // Vérification des données
            if (!email || !password) {
                console.log('Champs manquants pour la connexion');
                return res.status(400).json({ 
                    message: 'Email et mot de passe requis' 
                });
            }

            // Find user by email
            console.log('Recherche de l\'utilisateur...');
            const user = await User.findByEmail(email);
            if (!user) {
                console.log('Utilisateur non trouvé:', email);
                return res.status(400).json({ 
                    message: 'Email ou mot de passe incorrect' 
                });
            }

            // Verify password
            console.log('Vérification du mot de passe...');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Mot de passe incorrect pour:', email);
                return res.status(400).json({ 
                    message: 'Email ou mot de passe incorrect' 
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            console.log('Connexion réussie pour:', email);
            res.json({
                message: 'Connexion réussie',
                token
            });
        } catch (error) {
            console.error('Erreur détaillée lors de la connexion:', error);
            res.status(500).json({ 
                message: 'Une erreur est survenue lors de la connexion',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

module.exports = AuthController; 