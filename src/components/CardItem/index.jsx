import React from "react";
import { Box, Typography } from "@mui/material";

const CardItem = ({ title }) => {
  return (
    <Box className="bg-white p-4 rounded-2xl shadow-md">
      <Typography variant="h6" className="mb-2">
        {title}
      </Typography>
      <Box className="h-40 flex items-center justify-center text-gray-400">
        Chart here
      </Box>
    </Box>
  );
};

export default CardItem;
