import {createSlice, createAsyncThunk,} from "@reduxjs/toolkit"
import { data } from "react-router-dom";

export const fetchEmployees = createAsyncThunk(
    "employees/fetchAll",
    async (_, { rejectWithValue } ) => {
        try {
            const response = await fetch(
                "http://localhost:8095/api/employees/all-users",
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const employeesSlice = createSlice({
    name: "employees",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
        })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
        })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
        })
    },
})

export default employeesSlice.reducer;
