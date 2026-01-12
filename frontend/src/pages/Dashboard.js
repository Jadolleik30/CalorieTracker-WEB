import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Dashboard() {
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  async function loadMeals() {
    const data = await apiFetch("/meals");
    setMeals(data.meals);
  }

  useEffect(() => {
    loadMeals();
  }, []);

  async function addMeal(e) {
    e.preventDefault();

    await apiFetch("/meals", {
      method: "POST",
      body: JSON.stringify({
        name,
        calories,
        type: "general",
        meal_date: new Date().toISOString().slice(0, 10),
      }),
    });

    setName("");
    setCalories("");
    loadMeals();
  }

  const total = meals.reduce((sum, m) => sum + Number(m.calories), 0);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <h2>Total Calories: {total}</h2>

      <form onSubmit={addMeal}>
        <input
          placeholder="Meal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
        <button>Add</button>
      </form>

      <ul>
        {meals.map((m) => (
          <li key={m.id}>
            {m.name} – {m.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
}
