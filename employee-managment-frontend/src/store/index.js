import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import departmentsReducer from "./departmentsSlice"
import employeesReducer from "./employeesSlice"
import tasksReducer from './tasksSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        departments: departmentsReducer,
        employees: employeesReducer, 
        tasks: tasksReducer,
    },
});

export default store;