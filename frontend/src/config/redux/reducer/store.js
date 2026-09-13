
import authReducer from "./authReducer/index.js";
import postReducer from "./postReducer/index.js"
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postReducer
    }
})