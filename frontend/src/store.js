import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import adminReducer from './slices/adminSlice'

const Store = configureStore({
    reducer:{
        auth:authReducer,
        admin:adminReducer,
    }
})
export default Store;