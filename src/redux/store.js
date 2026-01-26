import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-reducer";
import api from "../api/api";
import miscSlice from "./reducers/misc-reducer-";
import chatSlice from "./reducers/chat-reducer";
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware,
  ],
  devTools: true,
});
export default store;
