import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';

import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'username']
}));
app.options('*', cors());


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port "+ PORT);
  connectDB();
});
