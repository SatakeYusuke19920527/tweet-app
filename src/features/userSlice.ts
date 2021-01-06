import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { initialStateType } from '../types/userType';
import { User } from '../types/User';

const initialState:initialStateType = {
  user: { uid: "", photoUrl: "", displayName: "" }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = initialState.user
    },
    updateUserProfile: (state, action: PayloadAction<User>) => {
      state.user.photoUrl = action.payload.photoUrl;
      state.user.displayName = action.payload.displayName;
    }
  },
});

export const { login, logout,updateUserProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
