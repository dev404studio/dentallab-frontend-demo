import React, { useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Box, Tooltip 
} from "@mui/material";
// 👉 Đã xóa import Edit
import { Delete, Refresh as RefreshIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCongDoan, deleteCongDoan } from "../../redux/slices/congDoanSlice";
import CongDoanModal from "./CongDoanModal";

export default function CongDoanTable() {
  const dispatch = useDispatch();
  const { data = [], loading } = useSelector((state) => state.congDoan || {});

  useEffect(() => {
    dispatch(fetchCongDoan());
  }, [dispatch]);

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <div className="text-gray-500 text-sm italic">
          * Đây là kho dữ liệu các bước để bạn nhặt vào sản phẩm
        </div>
        <div className="flex gap-2">
           <CongDoanModal />
           <IconButton onClick={() => dispatch(fetchCongDoan())} disabled={loading}>
             <RefreshIcon className={loading ? "animate-spin" : ""} />
           </IconButton>
        </div>
      </Box>

      <TableContainer component={Paper} className="rounded-xl shadow-md border border-gray-100">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell width="10%"><b>STT</b></TableCell>
              <TableCell><b>Tên Công Đoạn</b></TableCell>
              <TableCell align="center" width="15%"><b>Thao Tác</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow key={item._id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-700">{item.tenCongDoan}</TableCell>
                <TableCell align="center">
                  {/* 👉 Chỉ còn duy nhất nút Xóa */}
                  <Tooltip title="Xóa">
                    <IconButton 
                      size="small" 
                      onClick={() => { if(window.confirm(`Bạn có chắc chắn muốn xóa công đoạn "${item.tenCongDoan}" không?`)) dispatch(deleteCongDoan(item._id)) }}
                    >
                      <Delete className="text-red-500" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            
            {data?.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={3} align="center" className="text-gray-400 py-10">
                  Chưa có công đoạn nào trong kho
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}