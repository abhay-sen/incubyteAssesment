import React, { useState} from "react";
import type { FormEvent } from "react";

// Define the shape of the props the component expects


const RegisterPage: React.FC = () => {
  // State for each form field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to hold the password mismatch error message
  const [error, setError] = useState("");

  // Determine if the register button should be disabled
  const isButtonDisabled = !name || !email || !password || !confirmPassword;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent the default browser form submission behavior
    event.preventDefault();

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return; // Stop the submission
    }

    // 2. Clear any previous errors
    setError("");

    // 3. Call the onRegister callback with the user data
    console.log({name, email, password});
  };

  return (
    <div
      style={{ fontFamily: "sans-serif", maxWidth: "400px", margin: "auto" }}
    >
      <h2>Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          {/* Label exactly "Password" to match the test `getByLabelText(/^password$/i)` */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        {/* Conditionally render the error message */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={isButtonDisabled}
          style={{ width: "100%", padding: "10px", cursor: "pointer" }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
