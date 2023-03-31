import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
	user: null,
	error: false,
	isSuccess: false,
	isLoading: false,
	message: ''
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder => {}
});

export default authSlice.reducer;
