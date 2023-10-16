import { ObjectType } from '@lib/shared/interfaces/base';
import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
	sidebarOpen: true,
	userInfo: {} as ObjectType,
};

const metaSlice = createSlice({
	name: 'metaSlice',
	initialState: INITIAL_STATE,
	reducers: {
		setSidebarState: (state, { payload }) => {
			state.sidebarOpen = payload;
		},
		setUserInfo: (state, { payload }) => {
			state.userInfo = payload;
		},
	},
});

export const metaAction = metaSlice.actions;
export default metaSlice.reducer;
