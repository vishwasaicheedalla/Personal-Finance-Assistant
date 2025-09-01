import { Clerk } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv'; // Import dotenv here as well

dotenv.config();

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const clerkAuth = async (req, res, next) => {
  // ... the rest of your file remains the same
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header provided." });
  }
  const token = authHeader.split(' ')[1];

  try {
    const claims = await clerk.verifyToken(token);
    if (!claims) {
      return res.status(401).json({ message: "Invalid token." });
    }
    req.auth = claims;
    next();
  } catch (error) {
    console.error(error); // This will log the full error object
    return res.status(401).json({ message: "Authentication failed.", error: error.message });
  }
};