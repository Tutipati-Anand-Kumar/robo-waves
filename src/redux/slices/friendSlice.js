import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

export const sendFollowRequest = createAsyncThunk(
  'friends/sendRequest',
  'friends/sendRequest',
  async (targetUserId, { rejectWithValue }) => {
    try {
      const response = await api.post('/follow/send-request', { targetUserId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptFollowRequest = createAsyncThunk(
  'friends/acceptRequest',
  async (followerId, { rejectWithValue }) => {
    try {
      const response = await api.post('/follow/accept-request', { followerId });
      return { followerId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectFollowRequest = createAsyncThunk(
  'friends/rejectRequest',
  async (followerId, { rejectWithValue }) => {
    try {
      const response = await api.post('/follow/reject-request', { followerId });
      return { followerId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
};

const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Send
      .addCase(sendFollowRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFollowRequest.fulfilled, (state) => {
        state.loading = false;
        toast.success('Follow request sent');
      })
      .addCase(sendFollowRequest.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message || 'Failed to send request');
      })
      // Accept
      .addCase(acceptFollowRequest.fulfilled, (state) => {
        state.loading = false;
        toast.success('Request accepted');
      })
      // Reject
      .addCase(rejectFollowRequest.fulfilled, (state) => {
        state.loading = false;
        toast.success('Request rejected');
      });
  },
});

/* EXPORTS */

export const {
  setInitialRequests,
  addPendingRequest,
  removePendingRequest,
} = followSlice.actions;

export default followSlice.reducer;