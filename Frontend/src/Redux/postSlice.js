import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
    postt: [],
    userPost: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.postt = action.payload;
    },
    setUserPost: (state, action) => {
      state.userPost = action.payload;
    },
  },
});

export const { setPosts, setUserPost } = postSlice.actions;
export default postSlice.reducer;