// src/pages/Tracker.js
import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";

export default function Tracker() {
  const today = new Date().toISOString().slice(0, 10);

  const [dailyGoal, setDailyGoal] = useState(2000);
  const [meal, setMeal] = useState({
    name: "",
    calories: "",
    type: "Breakfast",
  });
  const [meals, setMeals] = useState([]);
  const [err, setErr] = useState("");

  // totals
  const totalCalories = useMemo(
    () => meals.reduce((sum, m) => sum + Number(m.calories || 0), 0),
    [meals]
  );

  const remaining = Math.max(dailyGoal - totalCalories, 0);
  const percentage =
    dailyGoal > 0 ? Math.min((totalCalories / dailyGoal) * 100, 100) : 0;

  // load from backend (goal + meals)
  useEffect(() => {
    async function load() {
      try {
        setErr("");

        const g = await apiFetch(`/goal.php?date=${today}`);
        setDailyGoal(g.daily_goal);

        const m = await apiFetch(`/meals.php?date=${today}`);
        setMeals(m.meals);
      } catch (e) {
        setErr(e.message);
      }
    }

    load();
  }, [today]);

  // update goal in backend when user changes it
  async function handleGoalChange(e) {
    const newGoal = Number(e.target.value) || 0;
    setDailyGoal(newGoal);

    try {
      setErr("");
      await apiFetch(`/goal.php?date=${today}`, {
        method: "POST",
        body: JSON.stringify({ daily_goal: newGoal }),
      });
    } catch (e2) {
      setErr(e2.message);
    }
  }

  function handleMealChange(e) {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
  }

  // add meal (POST) then reload list
  async function handleAddMeal(e) {
    e.preventDefault();

    try {
      setErr("");

      await apiFetch("/meals.php", {
        method: "POST",
        body: JSON.stringify({
          name: meal.name,
          calories: meal.calories,
          type: meal.type,
          meal_date: today,
        }),
      });

      // reload meals
      const m = await apiFetch(`/meals.php?date=${today}`);
      setMeals(m.meals);

      // reset input
      setMeal({ name: "", calories: "", type: meal.type });
    } catch (e2) {
      setErr(e2.message);
    }
  }

  // delete meal
  async function handleDelete(id) {
    try {
      setErr("");
      await apiFetch(`/meals.php?id=${id}`, { method: "DELETE" });
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (e2) {
      setErr(e2.message);
    }
  }

  // clear all (simple way: delete each one)
  async function handleClear() {
    try {
      setErr("");
      for (const m of meals) {
        // eslint-disable-next-line no-await-in-loop
        await apiFetch(`/meals.php?id=${m.id}`, { method: "DELETE" });
      }
      setMeals([]);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <section className="page">
      <h2>Daily Calorie Tracker</h2>

      {err && <p className="error-text">{err}</p>}

      <div className="tracker-grid">
        {/* Left: goal + add meal */}
        <div className="card">
          <h3>Daily Goal</h3>

          <label className="inline-label">
            Calories:
            <input
              type="number"
              value={dailyGoal}
              onChange={handleGoalChange}
              min="0"
            />
          </label>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p>
              <strong>{totalCalories}</strong> / {dailyGoal} kcal
            </p>

            <p>
              Remaining: <strong>{remaining}</strong> kcal
            </p>
          </div>

          <hr />

          <h3>Add a Meal</h3>
          <form className="form" onSubmit={handleAddMeal}>
            <label>
              Meal name
              <input
                name="name"
                value={meal.name}
                onChange={handleMealChange}
                placeholder="e.g. Chicken salad"
                required
              />
            </label>

            <label>
              Calories
              <input
                type="number"
                name="calories"
                value={meal.calories}
                onChange={handleMealChange}
                placeholder="e.g. 450"
                min="0"
                required
              />
            </label>

            <label>
              Type
              <select name="type" value={meal.type} onChange={handleMealChange}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
                <option>Drink</option>
              </select>
            </label>

            <button className="btn primary" type="submit">
              Add Meal
            </button>
          </form>
        </div>

        {/* Right: list */}
        <div className="card">
          <div className="card-header">
            <h3>Today&apos;s Meals</h3>

            {meals.length > 0 && (
              <button className="btn secondary" onClick={handleClear}>
                Clear All
              </button>
            )}
          </div>

          {meals.length === 0 ? (
            <p className="muted">No meals added yet.</p>
          ) : (
            <ul className="meal-list">
              {meals.map((m) => (
                <li key={m.id} className="meal-item">
                  <div>
                    <strong>{m.name}</strong>
                    <span className="meal-type">{m.type}</span>
                  </div>

                  <div className="meal-right">
                    <span className="meal-calories">{m.calories} kcal</span>
                    <button
                      className="btn danger btn-sm"
                      onClick={() => handleDelete(m.id)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
