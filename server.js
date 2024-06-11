import app from './index.js';
import mongoose from 'mongoose';

//Mongoose setup
const PORT = process.env.PORT || 5003;
const CLIENT_URL = process.env.CLIENT_URL;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT} \nConnected to client at: ${CLIENT_URL}`));
    })
    .catch((error) => console.log(`${error.message} did not connect`));