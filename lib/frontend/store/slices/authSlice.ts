import { createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@frontend/configs/types';

const initialState = {
	token: '',
	refreshToken: '',
};

const authSlice = createSlice({
	name: 'authSlice',
	initialState,
	reducers: {
		setAuth: (state, { payload }) => {
			state.token = payload.token;
			state.refreshToken = payload.refreshToken;
		},
	},
});

// Selector
export const authSelector = createSelector([(state: RootState) => state.auth], (authState) => authState.auth);

export const authActions = authSlice.actions;
export default authSlice.reducer;
