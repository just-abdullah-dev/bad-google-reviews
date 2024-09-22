"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  balance: 0,
  reservedAmount: 0,
  id: "",
  email: "",
  token: "",
};

// Define the initial state dynamically to prevent SSR issues
let firstState = initialState;

const userSlice = createSlice({
  name: "user",
  initialState: firstState,
  reducers: {
    setUser: (state, action) => {
      const { name, avatar, balance, id, email, token, reservedAmount } =
        action.payload;
      state.name = name;
      state.avatar = avatar;
      state.balance = balance;
      state.id = id;
      state.email = email;
      state.token = token;
      state.reservedAmount = reservedAmount;
    },
    clearUser: (state) => {
      // Clear the state and reset to initial state
      state.name = initialState.name;
      state.avatar = initialState.avatar;
      state.balance = initialState.balance;
      state.id = initialState.id;
      state.email = initialState.email;
      state.token = initialState.token;
      state.reservedAmount = initialState.reservedAmount;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
