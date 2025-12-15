import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { acceptFollowRequest, rejectFollowRequest } from './friendSlice';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.post('/users/register', userData, config);

      const { token, user } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));

      console.log('Register - Token stored:', token);
      console.log('Register - User stored:', user);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/login', userData);

      const { token, user } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));

      console.log('Login - Token stored:', token);
      console.log('Login - User stored:', user);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.put('/users/profile', userData, config);

      const updatedUser = response.data;

      // Update session storage with new user data (keeping the same token if not refreshed)
      const currentUser = JSON.parse(sessionStorage.getItem('user'));
      const newToken = updatedUser.token || sessionStorage.getItem('token');

      sessionStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }));
      if (updatedUser.token) sessionStorage.setItem('token', newToken);

      return { user: updatedUser, token: newToken };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user?._id) return rejectWithValue('No user ID found');

      const response = await api.get(`/users/${user._id}`);
      const updatedUser = response.data;

      // Update session storage
      const currentUser = JSON.parse(sessionStorage.getItem('user'));
      sessionStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Fetch failed' });
    }
  }
);

const getUserFromStorage = () => {
  try {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: sessionStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      state.user = null;
      state.token = null;
      console.log('Logout - Token and User removed');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        toast.success('Registration successful!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Registration failed');
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Login failed');
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        if (action.payload.token) state.token = action.payload.token;
        toast.success('Profile updated successfully!');
      })
      .addCase(updateUser.rejected, (state, action) => {
        toast.error(action.payload.message || 'Update failed');
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      // Friend Actions (Sync Auth State)
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        const { followerId } = action.payload;
        if (state.user) {
          state.user.followRequests = state.user.followRequests.filter(id => id.toString() !== followerId);
          state.user.followers.push(followerId);
        }
      })
      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        const { followerId } = action.payload;
        if (state.user) {
          state.user.followRequests = state.user.followRequests.filter(id => id.toString() !== followerId);
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
