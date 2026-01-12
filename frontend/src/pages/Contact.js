import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true); // Just simulate submit
  }

  return (
    <section className="page">
      <h2>Contact</h2>
      <p>
        Have feedback, new idea, or a problem ? Just send us a message and we will get back to you .
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Write your message here..."
          />
        </label>

        <button className="btn primary" type="submit">
          Send Message
        </button>

        {submitted && (
          <p className="success-text">
            Thank you! Your message has been received (demo only).
          </p>
        )}
      </form>
    </section>
  );
}

export default Contact;
