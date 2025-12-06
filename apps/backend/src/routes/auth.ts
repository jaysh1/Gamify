import express, { Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../index";
import { AuthRequest, authenticateToken } from "../middleware/auth";
import { AuthPayload, AuthResponse, Student } from "../types";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, class: studentClass } = req.body as AuthPayload & {
      name: string;
      class?: string;
    };

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const existingUser = await pool.query("SELECT id FROM students WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create student
    const result = await pool.query(
      `INSERT INTO students (id, email, password_hash, name, class) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, class, avatar_url, accessibility_prefs, created_at, updated_at`,
      [uuidv4(), email, passwordHash, name, studentClass || null]
    );

    const student = result.rows[0];

    // Create JWT token
    const secret = (process.env.JWT_SECRET || "secret") as string;
    // @ts-ignore - string expiresIn is valid
    const token = jwt.sign(
      { studentId: student.id, email: student.email },
      secret,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    // Store session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      `INSERT INTO sessions (id, student_id, token, expires_at, created_ip) 
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), student.id, token, expiresAt, req.ip || null]
    );

    const response: AuthResponse = {
      token,
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        class: student.class,
        avatar_url: student.avatar_url,
        accessibility_prefs: student.accessibility_prefs,
        created_at: student.created_at,
        updated_at: student.updated_at,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as AuthPayload;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const result = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const student: Student = result.rows[0];
    const validPassword = await bcrypt.compare(password, student.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const secret = (process.env.JWT_SECRET || "secret") as string;
    // @ts-ignore - string expiresIn is valid
    const token = jwt.sign(
      { studentId: student.id, email: student.email },
      secret,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    // Store session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      `INSERT INTO sessions (id, student_id, token, expires_at, created_ip) 
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), student.id, token, expiresAt, req.ip || null]
    );

    const response: AuthResponse = {
      token,
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        class: student.class,
        avatar_url: student.avatar_url,
        accessibility_prefs: student.accessibility_prefs,
        created_at: student.created_at,
        updated_at: student.updated_at,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
router.post("/logout", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      await pool.query("DELETE FROM sessions WHERE token = $1", [token]);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Verify token
router.post("/verify", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, class, avatar_url, accessibility_prefs, created_at, updated_at 
       FROM students WHERE id = $1`,
      [req.user?.studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = result.rows[0];
    res.json({
      student,
      token: req.headers["authorization"]?.split(" ")[1],
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
