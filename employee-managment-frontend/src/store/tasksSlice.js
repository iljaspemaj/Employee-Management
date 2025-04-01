import {createSlice, createAsyncThunk,} from "@reduxjs/toolkit"

export const fetchTasks = createAsyncThunk(
    "tasks/fetchAll",
    async (_, { rejectWithValue } ) => {
        try {
            const response = await fetch("http://localhost:8095/api/all-tasks", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();
            
            return(data);
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
    tasks: [],
    loading: false,
    error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
    builder
        .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;  
        })
        .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        });
    },
});

export const { } = tasksSlice.actions;
export default tasksSlice.reducer;