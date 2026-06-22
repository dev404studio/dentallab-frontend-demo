import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { Info } from "lucide-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from "@mui/icons-material/Description";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function TabThongTinNhaKhoa({ nhaKhoaData }) {
  return (
    <Stack spacing={3}>
      <Card
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Phần tiêu đề phụ nhẹ nhàng */}
        <Box sx={{ bgcolor: "#f1f5f9", px: 3, py: 1.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Info size={18} /> THÔNG TIN CHI TIẾT
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* CỘT 1: LIÊN HỆ */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  textTransform: "uppercase",
                  mb: 2,
                  display: "block",
                }}
              >
                Liên lạc
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#eff6ff",
                      p: 1,
                      borderRadius: "10px",
                      display: "flex",
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {nhaKhoaData?.soDienThoai || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#eff6ff",
                      p: 1,
                      borderRadius: "10px",
                      display: "flex",
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Địa chỉ Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {nhaKhoaData?.email || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* CỘT 2: VỊ TRÍ */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  textTransform: "uppercase",
                  mb: 2,
                  display: "block",
                }}
              >
                Vị trí
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#fff1f2",
                      p: 1,
                      borderRadius: "10px",
                      display: "flex",
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Địa chỉ cụ thể
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {nhaKhoaData?.diaChiCuThe}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#f0fdf4",
                      p: 1,
                      borderRadius: "10px",
                      display: "flex",
                    }}
                  >
                    <MapIcon sx={{ fontSize: 20, color: "#22c55e" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Khu vực
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {nhaKhoaData?.quanHuyen}, {nhaKhoaData?.tinh}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* PHẦN MÔ TẢ TRẢI DÀI */}
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 18 }} /> Ghi chú & Mô tả
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", lineHeight: 1.6 }}
                >
                  {nhaKhoaData?.moTa ||
                    "Hiện chưa có thông tin mô tả chi tiết cho nha khoa này."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Stack>
  );
}
