import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = () => {
  const uri = process.env.MONGO_URI;
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function() {
      console.log('Connected to MongoDB');
    })
    .catch(function(err) {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
};

export { connectDB };