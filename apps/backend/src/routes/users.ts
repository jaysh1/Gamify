import express, { Response } from "express";
import { pool } from "../index";
import { AuthRequest, authenticateToken } from "../middleware/auth";

const router = express.Router();

// Get current user profile
router.get("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, class, avatar_url, accessibility_prefs, created_at, updated_at 
       FROM students WHERE id = $1`,
      [req.user?.studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.patch("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, class: studentClass, avatar_url, accessibility_prefs } = req.body;
    const studentId = req.user?.studentId;

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (studentClass !== undefined) {
      updateFields.push(`class = $${paramIndex++}`);
      values.push(studentClass);
    }

    if (avatar_url !== undefined) {
      updateFields.push(`avatar_url = $${paramIndex++}`);
      values.push(avatar_url);
    }

    if (accessibility_prefs !== undefined) {
      updateFields.push(`accessibility_prefs = $${paramIndex++}`);
      values.push(JSON.stringify(accessibility_prefs));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updateFields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    values.push(studentId);

    const query = `
      UPDATE students 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING id, email, name, class, avatar_url, accessibility_prefs, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
