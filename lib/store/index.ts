import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import metaReducer from "./slices/metaSlice";
import postReducer from "./slices/postSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Attach and initialize store
const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    post: postReducer,
    meta: metaReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  }),
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), apiSlice.middleware],
});

export default store;
