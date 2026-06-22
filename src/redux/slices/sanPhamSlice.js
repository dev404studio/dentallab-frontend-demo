import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/* ================= GET ALL ================= */
export const fetchSanPham = createAsyncThunk(
    "sanPham/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/sanpham");
            return res.data; // Tùy vào API backend trả về res.data hay res.data.data
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Lỗi tải dữ liệu sản phẩm"
            );
        }
    }
);

/* ================= CREATE ================= */
export const createSanPham = createAsyncThunk(
    "sanPham/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/sanpham", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Tạo sản phẩm thất bại"
            );
        }
    }
);

/* ================= UPDATE ================= */
export const updateSanPham = createAsyncThunk(
    "sanPham/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/sanpham/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Cập nhật sản phẩm thất bại"
            );
        }
    }
);

/* ================= DELETE ================= */
export const deleteSanPham = createAsyncThunk(
    "sanPham/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/sanpham/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Xóa sản phẩm thất bại"
            );
        }
    }
);

/* ================= SLICE ================= */

const sanPhamSlice = createSlice({
    name: "sanPham",

    initialState: {
        data: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            /* ===== FETCH ===== */
            .addCase(fetchSanPham.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSanPham.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSanPham.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createSanPham.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSanPham.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload);
            })
            .addCase(createSanPham.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateSanPham.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            /* ===== DELETE ===== */
            .addCase(deleteSanPham.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (item) => item._id !== action.payload
                );
            });
    },
});

export default sanPhamSlice.reducer;