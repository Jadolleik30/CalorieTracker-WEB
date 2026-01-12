import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../db.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?,?,?)",
      [name, email, hash]
    );
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Email already exists" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [users] = await pool.execute(
    "SELECT * FROM users WHERE email=? LIMIT 1",
    [email]
  );

  if (!users.length) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = users[0];
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await pool.execute(
    `
    INSERT INTO tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    `,
    [user.id, tokenHash]
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

export default router;
