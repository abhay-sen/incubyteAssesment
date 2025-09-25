import { createAsyncThunk } from "@reduxjs/toolkit";
const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: { name: string; email: string; password: string }) => {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
);
export default registerUser;