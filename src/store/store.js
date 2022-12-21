import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./sllices/ordersSlice";

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
    },
});
