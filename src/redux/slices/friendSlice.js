// src/redux/slices/followSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  acceptFollowRequestAPI,
  sendFollowRequestAPI,
  rejectFollowRequestAPI,
} from "./followServices";

/* THUNKS */

export const sendFollowRequest = createAsyncThunk(
  "follow/sendRequest",
  async ({ targetUsername }, { rejectWithValue }) => {
    try {
      return await sendFollowRequestAPI(targetUsername);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send request"
      );
    }
  }
);

export const acceptFollowRequest = createAsyncThunk(
  "follow/acceptRequest",
  async ({ followerId }, { rejectWithValue }) => {
    try {
      return await acceptFollowRequestAPI(followerId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Accept request failed"
      );
    }
  }
);

export const rejectFollowRequest = createAsyncThunk(
  "follow/rejectRequest",
  async ({ followerId }, { rejectWithValue }) => {
    try {
      await rejectFollowRequestAPI(followerId);
      return followerId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Reject failed"
      );
    }
  }
);

/* SLICE */

const followSlice = createSlice({
  name: "follow",
  initialState: {
    requests: [],
    status: "idle",
    error: null,
  },

  // ✅ ONE reducers object only
  reducers: {

    setInitialRequests: (state, action) => {
      state.requests = action.payload;
    },
    // 🟢 socket: follow request received
    addPendingRequest: (state, action) => {
      state.requests.unshift(action.payload);
    },

    // 🟢 socket: request accepted / rejected
    removePendingRequest: (state, action) => {
      state.requests = state.requests.filter(
        (req) => req._id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendFollowRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendFollowRequest.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendFollowRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(acceptFollowRequest.fulfilled, (state) => {
        state.status = "succeeded";
        const followerId = action.meta.arg.followerId;

        state.requests = state.requests.filter(
            (req) => req._id !== followerId
          );
      })
      .addCase(rejectFollowRequest.fulfilled, (state) => {
        state.status = "succeeded";
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