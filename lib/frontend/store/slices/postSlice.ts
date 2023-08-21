import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'lib/frontend/configs/types';
import { ObjectType } from 'lib/shared/interfaces/base';

const initialState: { posts: Array<any>; filter: ObjectType; order: ObjectType } = {
	posts: [],
	filter: {},
	order: {},
};

const postSlice = createSlice({
	name: 'postSlice',
	initialState,
	reducers: {
		setPosts: (state, { payload }) => {
			state.posts = payload;
		},
	},
});

// selector
export const postsSelector = createSelector([(state: RootState) => state.post], (postState) => postState.posts);

export const postActions = postSlice.actions;
export default postSlice.reducer;
