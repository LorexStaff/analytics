import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/model/authSlice";
import reportReducer from "../features/ReportBuilder/model/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    report: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
