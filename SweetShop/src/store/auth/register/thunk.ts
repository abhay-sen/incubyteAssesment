import { createAsyncThunk } from "@reduxjs/toolkit";
const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: { name: string; email: string; password: string }) => {
    const res = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  }
);
export default registerUser;