import User from "../models/user.js";

export const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}


export const postUser = async (req, res) => {
    try {
        const { _id, name, gender, school } = req.body;
        console.log(req.body)
        if (!_id) {
            console.log("new user");
            const newUser = new User({
                name, gender, school,
            });
            await newUser.save();
            res.status(201).json({ newUser });
        }
        else {
            console.log("update user");
            const user = await User.findById(_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (name) user.name = name;
            if (gender) user.gender = gender;
            if (school) user.school = school;

            const updatedUser = await user.save();
            return res.json({ updatedUser });
        }
    } catch (error) {
        console.log(error);
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
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne({ _id: id });
        res.json({ message: 'User deleted successfully', user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}