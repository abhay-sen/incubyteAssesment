import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import registerUser from "./thunk"; // Assuming your thunk file is in the same directory

// You can define a more specific type for your user data
interface UserData {
  id: string;
  name: string;
  email: string;
  token: string;
}

// The interface for the authentication state slice
interface AuthState {
  data: UserData | null;
  success: boolean;
  loading: boolean;
  error: string | null;
}

// The initial state must match the shape of the interface
const initialState: AuthState = {
  data: null,
  success: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null; // Clear previous data on a new request
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.loading = false;
          state.success = true;
          state.data = action.payload; // Store the user data from the successful response
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false; // Explicitly set success to false on failure
        // Prefer getting the error message from the payload if the thunk is configured to return it
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Registration Failed";
      });
  },
});

export default authSlice.reducer;
