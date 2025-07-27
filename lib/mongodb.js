import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB is already connected.');
    return;
  }

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI);
    console.log('MongoDB is connected successfully.');
    return;
  } catch (error) {
    console.log('MongoDB connection failed:', error);
    throw error;
  }
};

export default connectDB; 