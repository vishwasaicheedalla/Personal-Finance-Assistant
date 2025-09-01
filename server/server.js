import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your API routes
import transactionRoutes from './routes/transactionRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';

// Load environment variables from the .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());

// API Routes
app.get('/', (req, res)=> res.send('Server is Live!'))
app.use('/api/transactions', transactionRoutes);
app.use('/api/ocr', ocrRoutes);

// Server and Database Connection
const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });