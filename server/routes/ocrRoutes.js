import express from 'express';
import multer from 'multer';
import { extractDataFromReceipt } from '../controllers/ocrController.js';
import { clerkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/extract', clerkAuth, upload.single('receipt'), extractDataFromReceipt);

export default router;