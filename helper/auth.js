import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const { JWT_SECRET } = process.env;

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token: ",token);
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = user;
        next();
    });
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("Roles: ",req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied', role: req.user.role, requiredRoles: roles});
        }
        next();
    };
};
