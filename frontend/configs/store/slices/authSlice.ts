import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	token: '',
	refreshToken: '',
	loading: false,
	error: null,
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

export const authActions = authSlice.actions;
export default authSlice.reducer;
