import React, { useState} from "react";
import type { FormEvent } from "react";
import { useAppDispatch } from "../store/hooks";
import registerUser from "../store/auth/register/thunk";
import { useNavigate } from "react-router";
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

  // importing dispatch
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1. Email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Password validation: minimum 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // 3. Password validation: at least one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    // 4. Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // If all checks pass, clear any previous errors
    setError("");

    // Proceed with the registration logic
    try {
      const resultAction = await dispatch(
        registerUser({ name, email, password })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        // Registration succeeded
        console.log("Registration successful!");
        navigate("/"); // redirect to home page
      } else {
        // Registration failed
        setError(
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "Registration failed"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
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
