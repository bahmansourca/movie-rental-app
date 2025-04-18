const User = require('../models/userModel');
const Rental = require('../models/rentalModel');

class UserController {
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching user profile' });
        }
    }

    static async getRentalHistory(req, res) {
        try {
            const rentals = await Rental.findByUserId(req.user.id);
            res.json(rentals);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching rental history' });
        }
    }
}

module.exports = UserController; 