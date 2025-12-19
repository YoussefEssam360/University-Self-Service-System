import React, { useState } from "react";

export default function StudentRegistrationPage() {
  const [form, setForm] = useState({
    fullName: "",
    studentNumber: "",
    major: "",
    phoneNumber: "",
    dateOfBirth: ""
  });

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    // TODO: Call backend API to submit registration data
    console.log("submit registration", form);
    alert("Registration submitted (stub)");
  }

  return (
    <section>
      <h1>Registration</h1>

      <form className="registration-form" onSubmit={onSubmit} style={{ maxWidth: 720 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={onChange} required />
          </label>

          <label>
            Student number
            <input name="studentNumber" value={form.studentNumber} onChange={onChange} required />
          </label>

          <label>
            Major
            <input name="major" value={form.major} onChange={onChange} />
          </label>

          <label>
            Phone number
            <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
          </label>

          <label>
            Date of birth
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} />
          </label>

          <div>
            <button type="submit">Save registration</button>
          </div>
        </div>
      </form>
    </section>
  );
}