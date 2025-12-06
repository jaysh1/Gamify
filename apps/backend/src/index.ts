import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { initializeDatabase } from "./db/init";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Database connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start server
async function start() {
  try {
    // Initialize database
    await initializeDatabase();
    console.info("Database initialized successfully");

    // Test database connection
    const result = await pool.query("SELECT NOW()");
    console.info("Database connected:", result.rows[0]);

    app.listen(port, () => {
      console.info(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
