import crypto from "crypto";
import pool from "../db.js";

export async function requireUser(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = auth.split(" ")[1];
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [rows] = await pool.execute(
    `
    SELECT u.id, u.name, u.email
    FROM tokens t
    JOIN users u ON u.id = t.user_id
    WHERE t.token_hash = ? AND t.expires_at > NOW()
    LIMIT 1
    `,
    [tokenHash]
  );

  if (!rows.length) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }

  req.user = rows[0];
  next();
}
