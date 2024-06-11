import User from '../models/user.js';
import { generateToken } from '../helper/auth.js';
import logger from '../helper/logger.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.username === 'unregistered' || user.password === 'notset')  {
            return res.status(401).json({ message: 'Invalid username' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: `Logged in successfully as ${user.role}`, token, user });
    } catch (error) {
        logger.error({
            message: error.message,
            path: req.originalUrl,
            method: req.method,
            responseCode: 500
        });
        res.status(500).json({ message: error.message });
    }
};
//Debugging
export const set = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user.username = username;
        user.role = role;
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}