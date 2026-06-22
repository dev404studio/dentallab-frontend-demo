import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../config/api";

/* ================= GET ALL ================= */
export const fetchNguoiLienHe = createAsyncThunk(
  "nguoiLienHe/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/nguoilienhe");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tải dữ liệu"
      );
    }
  }
);

/* ================= CREATE ================= */
export const createNguoiLienHe = createAsyncThunk(
  "nguoiLienHe/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/nguoilienhe", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo thất bại"
      );
    }
  }
);

/* ================= UPDATE ================= */
export const updateNguoiLienHe = createAsyncThunk(
  "nguoiLienHe/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/nguoilienhe/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật thất bại"
      );
    }
  }
);

/* ================= DELETE ================= */
export const deleteNguoiLienHe = createAsyncThunk(
  "nguoiLienHe/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/nguoilienhe/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa thất bại"
      );
    }
  }
);

/* ================= SLICE ================= */

const nguoiLienHeSlice = createSlice({
  name: "nguoiLienHe",

  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ===== FETCH ===== */
      .addCase(fetchNguoiLienHe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNguoiLienHe.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNguoiLienHe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== CREATE ===== */
      .addCase(createNguoiLienHe.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNguoiLienHe.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(createNguoiLienHe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateNguoiLienHe.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      /* ===== DELETE ===== */
      .addCase(deleteNguoiLienHe.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default nguoiLienHeSlice.reducer;