import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/* ================= GET ALL ================= */
export const fetchQuyTrinh = createAsyncThunk(
    "quyTrinh/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/quytrinh");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Lỗi tải dữ liệu quy trình"
            );
        }
    }
);

/* ================= CREATE ================= */
export const createQuyTrinh = createAsyncThunk(
    "quyTrinh/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/quytrinh", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Tạo quy trình thất bại"
            );
        }
    }
);

/* ================= UPDATE ================= */
export const updateQuyTrinh = createAsyncThunk(
    "quyTrinh/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/quytrinh/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Cập nhật quy trình thất bại"
            );
        }
    }
);

/* ================= DELETE ================= */
export const deleteQuyTrinh = createAsyncThunk(
    "quyTrinh/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/quytrinh/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Xóa quy trình thất bại"
            );
        }
    }
);

/* ================= SLICE ================= */

const quyTrinhSlice = createSlice({
    name: "quyTrinh",

    initialState: {
        data: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            /* ===== FETCH ===== */
            .addCase(fetchQuyTrinh.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuyTrinh.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchQuyTrinh.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createQuyTrinh.pending, (state) => {
                state.loading = true;
            })
            .addCase(createQuyTrinh.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload);
            })
            .addCase(createQuyTrinh.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateQuyTrinh.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            /* ===== DELETE ===== */
            .addCase(deleteQuyTrinh.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (item) => item._id !== action.payload
                );
            });
    },
});

export default quyTrinhSlice.reducer;