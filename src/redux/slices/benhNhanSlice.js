import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../config/api";

/* ================= GET ALL ================= */
export const fetchBenhNhan = createAsyncThunk(
  "benhNhan/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/benhnhan");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tải dữ liệu"
      );
    }
  }
);

/* ================= CREATE ================= */
export const createBenhNhan = createAsyncThunk(
  "benhNhan/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/benhnhan", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo thất bại"
      );
    }
  }
);

/* ================= UPDATE ================= */
export const updateBenhNhan = createAsyncThunk(
  "benhNhan/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/benhnhan/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật thất bại"
      );
    }
  }
);

/* ================= DELETE ================= */
export const deleteBenhNhan = createAsyncThunk(
  "benhNhan/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/benhnhan/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa thất bại"
      );
    }
  }
);

/* ================= SLICE ================= */

const benhNhanSlice = createSlice({
  name: "benhNhan",

  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ===== FETCH ===== */
      .addCase(fetchBenhNhan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBenhNhan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBenhNhan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== CREATE ===== */
      .addCase(createBenhNhan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBenhNhan.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(createBenhNhan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateBenhNhan.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      /* ===== DELETE ===== */
      .addCase(deleteBenhNhan.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default benhNhanSlice.reducer;