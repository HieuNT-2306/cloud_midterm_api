import User from "../models/user.js";
import logger from "../helper/logger.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        logger.info({
            message: 'Fetched all student from the database: ',
            path: req.originalUrl,
            method: req.method,
            responseCode: 200
        });
        res.status(200).json(users);
    } catch (error) {
        logger.error({
            message: error.message,
            path: req.originalUrl,
            method: req.method,
            responseCode: 404
        });
        res.status(404).json({
            message: error.message,
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            logger.error({
                message: `User not found: ${id}`,
                path: req.originalUrl,
                method: req.method,
                responseCode: 404
            });
            logger.error(`User not found: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info({
            message: `Fetched user with id: ${id}`,
            path: req.originalUrl,
            method: req.method,
            responseCode: 200
        });
        res.status(200).json(user);
    } catch (error) {
        logger.error({
            message: error.message,
            path: req.originalUrl,
            method: req.method,
            responseCode: 404
        });
        res.status(404).json({
            message: error.message,
        });
    }
}


export const postUser = async (req, res) => {
    try {
        const { _id, name, gender, school } = req.body;
        if (!_id) {
            const newUser = new User({
                name, gender, school,
            });
            await newUser.save();
            logger.info({
                message: 'Created new student',
                path: req.originalUrl,
                method: req.method,
                responseCode: 201
            });
            res.status(201).json({ newUser });
        }
        else {
            const user = await User.findById(_id);
            if (!user) {
                logger.error({
                    message: `Student with id not found: ${_id}`,
                    path: req.originalUrl,
                    method: req.method,
                    responseCode: 404
                });
                return res.status(404).json({ message: 'Student not found' });
            }
            if (name) user.name = name;
            if (gender) user.gender = gender;
            if (school) user.school = school;
            const updatedUser = await user.save();
            logger.info({
                message: `Updated student: ${_id}`,
                path: req.originalUrl,
                method: req.method,
                responseCode: 200
            });
            return res.json({ updatedUser });
        }
    } catch (error) {
        logger.error({
            message: error.message,
            path: req.originalUrl,
            method: req.method,
            responseCode: 404
        });
        res.status(404).json({
            message: error.message,
        });
    }
};



export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            logger.error({
                message: `Student not found: ${id}`,
                path: req.originalUrl,
                method: req.method,
                responseCode: 404
            });
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne({ _id: id });
        logger.info({
            message: `Deleted user: ${id}`,
            path: req.originalUrl,
            method: req.method,
            responseCode: 200
        });
        res.json({ message: 'Student deleted successfully', user });
    }
    catch (error) {
        logger.error({
            message: error.message,
            path: req.originalUrl,
            method: req.method,
            responseCode: 404
        });
        res.status(500).json({ message: error.message });
    }
}
