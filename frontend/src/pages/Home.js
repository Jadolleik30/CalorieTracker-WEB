import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="page home">
      <div className="hero">
        <div>
          <h1>Track Your Daily Calories Easily</h1>
          <p>
            Calorie Tracker helps you stay on top of your meals, calories, and
            daily goals — all in a simple and clean interface.
          </p>
          <Link to="/tracker" className="btn primary">
            Start Tracking
          </Link>
        </div>

        <div className="hero-card">
          <h3>Example Day</h3>
          <p>Breakfast: 350 kcal</p>
          <p>Lunch: 650 kcal</p>
          <p>Snack: 200 kcal</p>
          <p>Dinner: 500 kcal</p>
          <hr />
          <p>
            <strong>Total:</strong> 1700 kcal
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;
