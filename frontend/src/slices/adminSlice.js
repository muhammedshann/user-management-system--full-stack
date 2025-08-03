import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../utils/axiosInstance';

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (query = '') => {
  const res = await axiosInstance.get(`/admin/users/?search=${query}`);
  return res.data;
});



export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`admin/delete_user/${id}/`);
      return res.data;
    } catch (err) {
        if (err.response && err.response.data) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue({ message: 'Server error. Please try again.' });
    }
  }
);

export const addUser = createAsyncThunk(
  'admin/addUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('admin/add_user/', formData);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Server error. Please try again.' });
    }
  }
);

export const adminUpdateUser = createAsyncThunk(
  'admin/adminUpdateUser',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`admin/update_user/${id}/`, formData);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Server error. Please try again.' });
    }
  }
);

export const adminSlice = createSlice({
    name:'admin',
    initialState:{
        users: [],
        loading: false,
        error: '',
    },
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state,action) => {
                state.users = action.payload;
                state.loading = false;
                state.error = null
            })
            .addCase(fetchUsers.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(addUser.pending, state => {
                state.loading = true;
                state.error = null
            })
            .addCase(addUser.fulfilled, (state,action) => {
                state.loading = false,
                state.error = null
                state.users.push(action.payload.user)
            })
            .addCase(addUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(deleteUser.pending, state => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.users = state.users.filter(user => user.id !== action.payload.id);
            })

            .addCase(deleteUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(adminUpdateUser.pending, state => {
                state.loading = true;
                state.error = false;
            })
            .addCase(adminUpdateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user;

                state.users = state.users.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })

            .addCase(adminUpdateUser.rejected , (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})
export default adminSlice.reducer;