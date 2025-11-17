import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null, // initially null
  suggestedUsers: [], // initially empty
  userProfile: null, // initially null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile } = authSlice.actions;
export default authSlice.reducer;
