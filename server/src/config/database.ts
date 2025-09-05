import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/homework';
    
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📦 MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};