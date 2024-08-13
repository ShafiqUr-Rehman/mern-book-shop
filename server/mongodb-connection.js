import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

connectToDatabase();

export default mongoose.connection;
