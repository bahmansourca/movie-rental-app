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
                return res.status(400).json({ message: 'Email already registered' });
            }

            // Create new user
            const userId = await User.create({ name, email, password });
            
            // Generate JWT token
            const token = jwt.sign(
                { id: userId },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error registering user' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await User.comparePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error logging in' });
        }
    }
}

module.exports = AuthController; 