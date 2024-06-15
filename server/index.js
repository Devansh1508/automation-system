const express = require('express');
const db = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// opening a port for the server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// database connection 
db.connect();

// middleware 
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.get('/', (req, res) => {
    res.send("Welcome to the automation system server");
})

// routes 
app.use('/api/v1/auth', authRoutes);