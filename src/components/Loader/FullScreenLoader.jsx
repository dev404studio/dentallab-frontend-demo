import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

export default function FullScreenLoader({ open }) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "#333",
        zIndex: (theme) => theme.zIndex.drawer + 999,
        backdropFilter: "blur(4px)", // 🔥 làm mờ nền
      }}
    >
      <CircularProgress size={60} thickness={4} />
    </Backdrop>
  );
}
