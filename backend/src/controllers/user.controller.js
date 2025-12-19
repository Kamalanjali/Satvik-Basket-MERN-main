import User from "../models/user.model.js";

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {   
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get a user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};      

// Controller to update user status
export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User status updated successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


