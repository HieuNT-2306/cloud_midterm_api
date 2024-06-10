import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other'
    },
    school: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        default: 'unregistered'
    },
    password: {
        type: String,
        required: true,
        default: 'notset'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {timestamps: true});


const User = mongoose.model('User', UserSchema); 
export default User;