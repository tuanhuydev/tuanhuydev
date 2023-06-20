import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas/rootSaga';
import authReducer from './slices/authSlice';

// Initialize saga middleware
const sagaMiddleware = createSagaMiddleware();

// Attach and initialize store
const store = configureStore({
	reducer: combineReducers({
		auth: authReducer,
	}),
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
