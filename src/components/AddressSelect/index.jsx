import React, { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";

export default function AddressSelect({ form, setForm }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  // 🔥 load tỉnh
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data));
  }, []);

  // 🔥 khi chọn tỉnh → load huyện
  const handleProvinceChange = async (e) => {
    const code = e.target.value;

    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${code}?depth=2`
    );

    setDistricts(res.data.districts);

    setForm({
      ...form,
      tinh: res.data.name,
      quanHuyen: "",
    });
  };

  // 🔥 chọn huyện
  const handleDistrictChange = (e) => {
    const district = districts.find((d) => d.code === e.target.value);

    setForm({
      ...form,
      quanHuyen: district.name,
    });
  };

  return (
    <>
      {/* TỈNH */}
      <TextField
        select
        label="Tỉnh/Thành"
        fullWidth
        onChange={handleProvinceChange}
      >
        {provinces.map((p) => (
          <MenuItem key={p.code} value={p.code}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      {/* QUẬN */}
      <TextField
        select
        label="Quận/Huyện"
        fullWidth
        className="mt-3"
        disabled={!districts.length}
        onChange={handleDistrictChange}
      >
        {districts.map((d) => (
          <MenuItem key={d.code} value={d.code}>
            {d.name}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
