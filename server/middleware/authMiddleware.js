import { Clerk } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv'; // Import dotenv here as well

dotenv.config();

// --- START DEBUGGING BLOCK ---
// This will print the environment variables to your terminal when the server starts.
console.log("--- CLERK ENVIRONMENT VARIABLES ---");
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Loaded" : "MISSING or empty");
console.log("CLERK_JWT_KEY:", process.env.CLERK_JWT_KEY ? "Loaded" : "MISSING or empty");
console.log("---------------------------------");
// --- END DEBUGGING BLOCK ---

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