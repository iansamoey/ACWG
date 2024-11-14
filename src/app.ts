import express from 'express';
import mongoose from 'mongoose';


const app = express();

// Middleware
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'your_connection_string_here'; // Use your connection string here

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error:', err));




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
