import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

testConnection();
