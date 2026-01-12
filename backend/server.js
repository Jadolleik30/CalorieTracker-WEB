import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import mealsRoutes from "./routes/meals.js";
import goalRoutes from "./routes/goal.js";

const app = express();

app.use(
  cors({
    origin: "*", // allow all for now
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/meals", mealsRoutes);
app.use("/goal", goalRoutes);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
