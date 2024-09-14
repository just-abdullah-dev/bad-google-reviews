'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  avatar: '',
  balance: 0,
  id: '',
  email: '',
  token: '',
};

// Define the initial state dynamically to prevent SSR issues
let firstState = initialState;

if (typeof window !== 'undefined') {
  // We are in the browser, so sessionStorage is accessible
  const storedUser = sessionStorage.getItem('user');
  firstState = storedUser ? JSON.parse(storedUser) : initialState;
}

const userSlice = createSlice({
  name: 'user',
  initialState: firstState,
  reducers: {
    setUser: (state, action) => {
      const { name, avatar, balance, id, email, token } = action.payload;
      state.name = name;
      state.avatar = avatar;
      state.balance = balance;
      state.id = id;
      state.email = email;
      state.token = token;

      // Save the user state to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(state));
      }
    },
    clearUser: (state) => {
      // Clear the state and reset to initial state
      state.name = initialState.name;
      state.avatar = initialState.avatar;
      state.balance = initialState.balance;
      state.id = initialState.id;
      state.email = initialState.email;
      state.token = initialState.token;

      // Clear sessionStorage on logout
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user');
      }
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;