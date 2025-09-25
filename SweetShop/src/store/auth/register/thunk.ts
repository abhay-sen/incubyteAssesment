import { createAsyncThunk } from "@reduxjs/toolkit";
const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }: { rejectWithValue: (value: unknown) => unknown }
  ) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Reject the thunk with backend error message
        return rejectWithValue(data.message || "Registration failed");
      }
      const token = data.token;
      if(token){
        localStorage.setItem("token", token);
      }
      else{
        return rejectWithValue("No token received");
      }
      return data; // Success
    } catch (err: unknown) {
      // Handle network errors
      if (err instanceof Error) {
        return rejectWithValue(err.message || "Network error");
      }
      return rejectWithValue("Network error");
    }
  }
);
export default registerUser;