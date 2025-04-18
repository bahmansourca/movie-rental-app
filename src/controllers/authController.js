const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

class AuthController {
    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const userId = await User.create({
                name,
                email,
                password: hashedPassword
            });
            
            // Generate JWT token
            const token = jwt.sign(
                { userId },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Connexion réussie',
                token
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ message: 'Erreur lors de la connexion' });
        }
    }
}

module.exports = AuthController; 