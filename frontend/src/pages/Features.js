import React from "react";

function Features() {
  const features = [
    {
      title: "Add Meals Quickly",
      text: "Log breakfast, lunch, dinner, or snacks in just a few clicks.",
    },
    {
      title: "Daily Goal Progress",
      text: "Set a calorie goal and see how much you have left for the day.",
    },
    {
      title: "Fully Responsive",
      text: "Works great on desktop, tablet, and mobile screens.",
    },
   
  ];

  return (
    <section className="page">
      <h2>Features</h2>
      <div className="feature-grid">
        {features.map((f) => (
          <div key={f.title} className="card">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
