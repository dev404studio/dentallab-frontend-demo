import { Box } from "@mui/material";
import CardItem from "../CardItem";

const Statistics = () => {
  return (
    <Box className="grid grid-cols-2 gap-4">
      <CardItem title="Hàng nhận theo loại" />
      <CardItem title="Tình hình nhận hàng" />
      <CardItem title="Top 10 Sản lượng theo nhóm" />
      <CardItem title="Doanh số theo thời gian" />
    </Box>
  );
};

export default Statistics;
