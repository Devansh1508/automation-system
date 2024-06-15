const mongoose = require('mongoose');
require('dotenv').config();

exports.connect=()=>mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error while connecting to MongoDB:', error);
    process.exit(1);
});