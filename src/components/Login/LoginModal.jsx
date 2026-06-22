import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { getAuthSelector } from "../../redux/selector";

export default function LoginModal() {
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(getAuthSelector);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    MSNV: "",
    Password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = () => {
    dispatch(login(form));
  };

  // 🔥 auto đóng modal khi login thành công
  useEffect(() => {
    if (isAuthenticated) {
      setOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <>
      {/* BUTTON OPEN */}
      <Button variant="contained" onClick={() => setOpen(true)}>
        Đăng nhập
      </Button>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Paper className="w-[900px] h-[500px] flex rounded-2xl overflow-hidden shadow-2xl">
            {/* LEFT */}
            <div className="w-1/2 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-500">
                  Dental<span className="text-yellow-500">SO</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Hệ thống quản lý nha khoa
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="w-[80%]">
                <h2 className="text-3xl font-bold mb-6">Login</h2>

                {/* USERNAME */}
                <TextField
                  label="Mã nhân viên"
                  fullWidth
                  margin="normal"
                  value={form.MSNV}
                  onChange={(e) => handleChange("MSNV", e.target.value)}
                />

                {/* PASSWORD */}
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={form.Password}
                  onChange={(e) => handleChange("Password", e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* ERROR */}
                {error && (
                  <Typography color="error" className="mt-2">
                    {error}
                  </Typography>
                )}

                {/* ACTION */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-500 text-sm cursor-pointer hover:underline">
                    Forgot password?
                  </span>

                  <Button
                    variant="contained"
                    className="rounded-full px-6"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        </Box>
      </Modal>
    </>
  );
}
