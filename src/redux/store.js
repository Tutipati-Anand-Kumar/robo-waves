import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import articleReducer from "./slices/articleSlice"
import notificationReducer from "./slices/notificationSlice";
import followReducer from "./slices/friendSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
    notifications: notificationReducer, 
    follow: followReducer,   
  },
});

export default store
