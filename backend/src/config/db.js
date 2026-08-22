import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Warning: MongoDB not available (${error.message})`);
    console.warn('The server will start without database. API routes will return errors until MongoDB is connected.');
    return null;
  }
};

export default connectDB;