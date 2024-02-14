import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "lib/configs/types";

const initialState = {
  token: "",
  refreshToken: "",
  currentUser: {},
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
  },
});

// Selector
export const currentUserSelector = createSelector(
  [(state: RootState) => state.auth],
  (authState) => authState.currentUser,
);
export const authActions = authSlice.actions;
export default authSlice.reducer;
