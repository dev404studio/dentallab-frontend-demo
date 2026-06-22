import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/* ================= GET ALL CONG DOAN ================= */
// Lấy toàn bộ "kho" công đoạn từ /api/congdoan
export const fetchCongDoan = createAsyncThunk(
    "congDoan/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/congdoan");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Lỗi tải danh sách công đoạn"
            );
        }
    }
);

/* ================= CREATE CONG DOAN ================= */
// Thêm một công đoạn mới vào kho dữ liệu
export const createCongDoan = createAsyncThunk(
    "congDoan/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/congdoan", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Tạo công đoạn thất bại"
            );
        }
    }
);

/* ================= UPDATE CONG DOAN ================= */
export const updateCongDoan = createAsyncThunk(
    "congDoan/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/congdoan/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Cập nhật công đoạn thất bại"
            );
        }
    }
);

/* ================= DELETE CONG DOAN ================= */
export const deleteCongDoan = createAsyncThunk(
    "congDoan/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/congdoan/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Xóa công đoạn thất bại"
            );
        }
    }
);

/* ================= SLICE ================= */

const congDoanSlice = createSlice({
    name: "congDoan",

    initialState: {
        data: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            /* ===== FETCH ===== */
            .addCase(fetchCongDoan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCongDoan.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCongDoan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createCongDoan.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCongDoan.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload); // Thêm công đoạn mới lên đầu danh sách
            })
            .addCase(createCongDoan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateCongDoan.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            /* ===== DELETE ===== */
            .addCase(deleteCongDoan.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (item) => item._id !== action.payload
                );
            });
    },
});

export default congDoanSlice.reducer;