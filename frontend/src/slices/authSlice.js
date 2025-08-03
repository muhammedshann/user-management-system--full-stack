import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const api_url = 'http://localhost:8000/api';

const getValidLocalUser = () => {
    const user = localStorage.getItem('user');
    try {
        return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;

    try {
      const result = await axios.post(`${api_url}/register/`, userData);
      const loginResult = await dispatch(loginUser(userData));

      if (loginUser.rejected.match(loginResult)) {
        return rejectWithValue({ message: 'Login failed after registration' });
      }

      return result.data;

    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Server error. Please try again.' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await axios.post(`${api_url}/login/`, userData);
      localStorage.setItem('accessToken', result.data.access);
      localStorage.setItem('refreshToken', result.data.refresh);
      localStorage.setItem('isAdmin', result.data.user.is_superuser);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      return result.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Server error. Please try again.' });
    }
  }
);


// 🔄 Update User
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('update_user/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem('user', JSON.stringify(res.data));

      return res.data;

    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Server error. Please try again.' });
    }
  }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: getValidLocalUser(),
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        isAdmin: localStorage.getItem('isAdmin') || null,
        loading: false,
        error: null,
        message: null
    },
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAdmin = null;
            localStorage.clear()
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.msg || 'Registration success';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.access;
                state.refreshToken = action.payload.refresh;
                state.userInfo = action.payload.user;
                state.isAdmin = action.payload.user.is_superuser
                console.log(state.isAdmin);
                
                state.message = action.payload.msg || 'Login success';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.detail;
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
