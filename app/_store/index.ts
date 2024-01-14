import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import metaReducer from "./slices/metaSlice";
import postReducer from "./slices/postSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Attach and initialize store
const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    post: postReducer,
    meta: metaReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  }),
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    apiSlice.middleware,
  ],
});

// Allow refetchOnFocus / refetchOnReconnect for all queries by default
setupListeners(store.dispatch);

export default store;
