import express from "express";
import pool from "../db.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

/* GET goal */
router.get("/", requireUser, async (req, res) => {
  const [rows] = await pool.execute(
    "SELECT calories FROM goals WHERE user_id=? LIMIT 1",
    [req.user.id]
  );

  res.json({ goal: rows[0]?.calories || 0 });
});

/* SET goal */
router.post("/", requireUser, async (req, res) => {
  const { calories } = req.body;

  await pool.execute(
    `
    INSERT INTO goals (user_id, calories)
    VALUES (?,?)
    ON DUPLICATE KEY UPDATE calories=?
    `,
    [req.user.id, calories, calories]
  );

  res.json({ success: true });
});

export default router;
