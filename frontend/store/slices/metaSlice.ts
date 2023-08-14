import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	sidebarOpen: false,
};

const metaSlice = createSlice({
	name: 'metaSlice',
	initialState: INITIAL_STATE,
	reducers: {
		setSidebarState: (state, { payload }) => {
			state.sidebarOpen = payload;
		},
	},
});

export const metaAction = metaSlice.actions;
export default metaSlice.reducer;
