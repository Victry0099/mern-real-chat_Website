import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, verfiyAdmin } from "../thunks/admin.js";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  loader: true,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    userExist: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },

    userNotExist: (state) => {
      state.user = null;
      state.loader = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isAdmin = true;
        toast.success(action.payload);
      })

      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        toast.error(action.error.message);
      })

      .addCase(verfiyAdmin.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAdmin = true;
        } else {
          state.isAdmin = false;
        }
      })
      .addCase(verfiyAdmin.rejected, (state, action) => {
        state.isAdmin = false;
      })

      .addCase(adminLogout.fulfilled, (state, action) => {
        state.isAdmin = false;
        toast.success(action.payload);
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.isAdmin = true;
        toast.error(action.error.message);
      });
  },
});

export default authSlice;

export const { userExist, userNotExist } = authSlice.actions;
