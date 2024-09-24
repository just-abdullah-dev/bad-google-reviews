"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  balance: 0,
  reservedAmount: 0,
  id: "",
  email: "",
  isAdmin: false
};

// Define the initial state dynamically to prevent SSR issues
let firstState = initialState;

const userSlice = createSlice({
  name: "user",
  initialState: firstState,
  reducers: {
    setUser: (state, action) => {
      const { name, avatar, balance, id, email, isAdmin, reservedAmount } =
        action.payload;
      state.name = name;
      state.avatar = avatar;
      state.balance = balance;
      state.id = id;
      state.email = email;
      state.isAdmin = isAdmin;
      state.reservedAmount = reservedAmount;
    },
    clearUser: (state) => {
      // Clear the state and reset to initial state
      state.name = initialState.name;
      state.avatar = initialState.avatar;
      state.balance = initialState.balance;
      state.id = initialState.id;
      state.email = initialState.email;
      state.isAdmin = initialState.isAdmin;
      state.reservedAmount = initialState.reservedAmount;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
