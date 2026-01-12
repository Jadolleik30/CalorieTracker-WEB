import express from "express";
import pool from "../db.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

/* GET meals */
router.get("/", requireUser, async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  const [meals] = await pool.execute(
    `
    SELECT id, name, calories, type, meal_date
    FROM meals
    WHERE user_id=? AND meal_date=?
    ORDER BY id DESC
    `,
    [req.user.id, date]
  );

  res.json({ meals });
});

/* ADD meal */
router.post("/", requireUser, async (req, res) => {
  const { name, calories, type, meal_date } = req.body;

  await pool.execute(
    `
    INSERT INTO meals (user_id, name, calories, type, meal_date)
    VALUES (?,?,?,?,?)
    `,
    [req.user.id, name, calories, type, meal_date]
  );

  res.json({ success: true });
});

/* DELETE meal */
router.delete("/:id", requireUser, async (req, res) => {
  await pool.execute(
    "DELETE FROM meals WHERE id=? AND user_id=?",
    [req.params.id, req.user.id]
  );

  res.json({ success: true });
});

export default router;
