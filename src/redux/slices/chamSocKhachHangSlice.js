import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

/* ================= API ================= */

// 📄 Lấy log theo nha khoa
export const fetchChamSocByNhaKhoa = createAsyncThunk(
  "chamSoc/fetchByNhaKhoa",
  async (nhaKhoaId, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/cham-soc-khach-hang/nha-khoa/${nhaKhoaId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lấy dữ liệu thất bại"
      );
    }
  }
);

// ➕ Tạo log
export const createChamSoc = createAsyncThunk(
  "chamSoc/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/cham-soc-khach-hang", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo thất bại"
      );
    }
  }
);

// ✏️ Update
export const updateChamSoc = createAsyncThunk(
  "chamSoc/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/cham-soc-khach-hang/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật thất bại"
      );
    }
  }
);

// ❌ Delete
export const deleteChamSoc = createAsyncThunk(
  "chamSoc/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/cham-soc-khach-hang/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa thất bại"
      );
    }
  }
);

/* ================= SLICE ================= */

const chamSocKhachHangSlice = createSlice({
  name: "chamSocKhachHang",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearChamSoc: (state) => {
      state.data = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== FETCH ===== */
      .addCase(fetchChamSocByNhaKhoa.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChamSocByNhaKhoa.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchChamSocByNhaKhoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== CREATE ===== */
      .addCase(createChamSoc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChamSoc.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload); // thêm lên đầu timeline
      })
      .addCase(createChamSoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateChamSoc.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      /* ===== DELETE ===== */
      .addCase(deleteChamSoc.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export const { clearChamSoc } = chamSocKhachHangSlice.actions;
export default chamSocKhachHangSlice.reducer;