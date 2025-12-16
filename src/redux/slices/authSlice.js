// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import api from "../../api/api";

// const initialState = {
//   user: null,
//   status: "idle",
//   error: null,
//   isAuthenticated: !!localStorage.getItem("authtoken"),

// };

// /* REGISTER USER */
// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("users/register", payload);

//       localStorage.setItem("authtoken", data.token);

//       return data;
//     } catch (err) {
//       const message =
//         err.response?.data?.message || err.message || "Registration failed";
//       return rejectWithValue(message);
//     }
//   }
// );

// /* LOGIN USER */
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("users/login", payload);
//       console.log(data)
//       localStorage.setItem("authtoken", data.token);

//       return data;
//     } catch (err) {
//       const message =
//         err.response?.data?.message || err.message || "Login failed";
//       return rejectWithValue(message);
//     }
//   }
// );

// /*  LOGOUT USER */
// export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
//   dispatch(logout()); // calls reducer below
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//   state.user = null;
//   state.isAuthenticated = false;

//   localStorage.removeItem("authtoken");
  
// },

//   },

//   extraReducers: (builder) => {
//     builder
//       /* REGISTER */
//       .addCase(registerUser.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//         state.profilePhoto = action.payload.user.profilePhoto;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })

//       /* LOGIN */
//       .addCase(loginUser.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//         state.profilePhoto = action.payload.user.profilePhoto;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })

//       /* LOGOUT */
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.profilePhoto = null;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;











import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { resetArticles } from "./articleSlice";

const initialState = {
  user: JSON.parse(localStorage.getItem("userData")) || null,
  status: "idle",
  error: null,
  isAuthenticated: !!localStorage.getItem("authtoken"),
  profilePhoto: localStorage.getItem("profilePhoto") || null,
};

/* REGISTER USER */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("users/register", payload);

      localStorage.setItem("authtoken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("profilePhoto", data.user.profilePhoto);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Registration failed"
      );
    }
  }
);

/* LOGIN USER */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("users/login", payload);

      localStorage.setItem("authtoken", data.token);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  }
);

/* LOGOUT */
export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  dispatch(resetArticles());
  dispatch(logout());
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profilePhoto = null;

      localStorage.removeItem("authtoken");
      localStorage.removeItem("userData");
      localStorage.removeItem("profilePhoto");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.profilePhoto = action.payload.user.profilePhoto;
        state.isAuthenticated = true;
      })

      // .addCase(loginUser.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.user = action.payload.user;
      //   state.profilePhoto = action.payload.user.profilePhoto;
      //   state.isAuthenticated = true;
      // })
      .addCase(loginUser.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.user = action.payload.user;
  state.profilePhoto = action.payload.user.profilePhoto;
  state.isAuthenticated = true;
})


      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.profilePhoto = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
