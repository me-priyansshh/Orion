// Redux Store Setup with Persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import commentSlice from "./commentSlice";

// Redux-Persist imports
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// 1️⃣ Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "post"], // ⬅️ persist both auth & post slices
};

// 2️⃣ Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  comment: commentSlice, // not persisted (temporary UI data)
});

// 3️⃣ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5️⃣ Persistor
export const persistor = persistStore(store);

export default store;
