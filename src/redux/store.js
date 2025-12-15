import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import articleReducer from './slices/articleSlice';
import friendReducer from './slices/friendSlice';

// Make sure to export using default or named export as per main.jsx expectation. 
// main.jsx code: `import store from "./redux/store"` -> Default export needed.
const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
    friends: friendReducer,
  },
});

export default store;
