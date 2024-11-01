// Import bcrypt
import bcrypt from 'bcrypt';

// Function to hash the password
async function hashPassword(plainPassword) {
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Hashed Password:', hashedPassword);
}

// Get the password from command-line arguments
const password = process.argv[2];

// Check if a password was provided
if (!password) {
    console.error('Please provide a password to hash.');
    process.exit(1);
}

// Run the hashing function
hashPassword(password);
