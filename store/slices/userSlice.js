import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  verifyEmail: null,
  userEmail: "",
  code: ''
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setVerifyEmail: (state, action) => {
      state.verifyEmail = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
});
export const { setCode, setVerifyEmail, setUserEmail } = userSlice.actions;
export default userSlice.reducer;