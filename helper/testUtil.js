import User from '../models/user.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createTestUser = async (username, password, role) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const school = 'Test School';
    const name = `${username} test username`;
    const user = new User({ name, school, username, password: hashedPassword, role });
    await user.save();
    return user;
};
