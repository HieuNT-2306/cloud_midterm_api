import mongoose from 'mongoose';

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
    }
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);  // User is the name of the model
export default User;