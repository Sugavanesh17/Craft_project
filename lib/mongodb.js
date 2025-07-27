import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB is already connected.');
    return;
  }

  try {
    await mongoose.connect("mongodb://localhost:27017/craftproject");
    console.log('MongoDB is connected successfully.');
    return;
  } catch (error) {
    console.log('MongoDB connection failed:', error);
    throw error;
  }
};

export default connectDB; 