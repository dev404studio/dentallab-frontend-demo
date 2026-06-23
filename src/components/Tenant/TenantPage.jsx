import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Alert,
    Snackbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../../config/api";

const STATUS_LABELS = {
    trial: { label: "Dùng thử", color: "info" },
    active: { label: "Đang hoạt động", color: "success" },
    suspended: { label: "Đã khoá", color: "error" },
    expired: { label: "Hết hạn", color: "warning" },
};

const emptyForm = {
    ownerName: "",
    ownerEmail: "",
    phone: "",
    adminPassword: "",
    trialDays: "7",
    notes: "",
};

export default function TenantPage() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    // Add/Edit Modal
    const [openForm, setOpenForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Extend Trial Modal
    const [openExtend, setOpenExtend] = useState(false);
    const [extendId, setExtendId] = useState(null);
    const [extendDays, setExtendDays] = useState(30);
    const [extendSubmitting, setExtendSubmitting] = useState(false);

    // Delete Dialog
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteName, setDeleteName] = useState("");
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    /* ============ FETCH ============ */
    const fetchTenants = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/tenants");
            setTenants(res.data || []);
        } catch (err) {
            showSnack(err.response?.data?.message || "Lỗi tải dữ liệu", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    /* ============ SNACK ============ */
    const showSnack = (message, severity = "success") =>
        setSnack({ open: true, message, severity });

    /* ============ FORM ============ */
    const handleOpenCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormErrors({});
        setOpenForm(true);
    };

    const handleOpenEdit = (tenant) => {
        setEditingId(tenant._id);
        setForm({
            ownerName: tenant.ownerName || "",
            ownerEmail: tenant.ownerEmail,
            phone: tenant.phone || "",
            adminPassword: "",
            trialDays: "7",
            notes: tenant.notes || "",
        });
        setFormErrors({});
        setOpenForm(true);
    };

    const validateForm = () => {
        const errs = {};
        if (!form.ownerEmail.trim()) errs.ownerEmail = "Bắt buộc";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.ownerEmail))
            errs.ownerEmail = "Email không hợp lệ";
        if (!editingId) {
            if (!form.adminPassword.trim()) errs.adminPassword = "Bắt buộc";
            const days = parseInt(form.trialDays);
            if (!days || days < 1) errs.trialDays = "Bắt buộc";
        }
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) {
            setFormErrors(errs);
            return;
        }
        setSubmitting(true);
        try {
            if (editingId) {
                await api.patch(`/tenants/${editingId}`, {
                    ownerName: form.ownerName,
                    phone: form.phone,
                    notes: form.notes,
                });
                showSnack("Cập nhật thành công");
            } else {
                await api.post("/tenants", {
                    ownerName: form.ownerName,
                    ownerEmail: form.ownerEmail,
                    phone: form.phone,
                    adminPassword: form.adminPassword,
                    trialDays: parseInt(form.trialDays),
                    notes: form.notes,
                });
                showSnack("Tạo thuê bao thành công");
            }
            setOpenForm(false);
            fetchTenants();
        } catch (err) {
            showSnack(err.response?.data?.message || "Có lỗi xảy ra", "error");
        } finally {
            setSubmitting(false);
        }
    };

    /* ============ EXTEND TRIAL ============ */
    const handleOpenExtend = (tenant) => {
        setExtendId(tenant._id);
        setExtendDays(30);
        setOpenExtend(true);
    };

    const handleExtend = async () => {
        setExtendSubmitting(true);
        try {
            const res = await api.patch(`/tenants/${extendId}/extend`, { days: extendDays });
            showSnack(res.data.message || "Gia hạn thành công");
            setOpenExtend(false);
            fetchTenants();
        } catch (err) {
            showSnack(err.response?.data?.message || "Có lỗi xảy ra", "error");
        } finally {
            setExtendSubmitting(false);
        }
    };

    /* ============ TOGGLE STATUS ============ */
    const handleToggleStatus = async (tenant) => {
        const newStatus = tenant.status === "suspended" ? "trial" : "suspended";
        const label = newStatus === "suspended" ? "khoá" : "mở khoá";
        try {
            await api.patch(`/tenants/${tenant._id}/status`, { status: newStatus });
            showSnack(`Đã ${label} thuê bao`);
            fetchTenants();
        } catch (err) {
            showSnack(err.response?.data?.message || "Có lỗi xảy ra", "error");
        }
    };

    /* ============ DELETE ============ */
    const handleOpenDelete = (tenant) => {
        setDeleteId(tenant._id);
        setDeleteName(tenant.tenantName);
        setOpenDelete(true);
    };

    const handleDelete = async () => {
        setDeleteSubmitting(true);
        try {
            await api.delete(`/tenants/${deleteId}`);
            showSnack("Đã xoá thuê bao");
            setOpenDelete(false);
            fetchTenants();
        } catch (err) {
            showSnack(err.response?.data?.message || "Có lỗi xảy ra", "error");
        } finally {
            setDeleteSubmitting(false);
        }
    };

    /* ============ HELPERS ============ */
    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("vi-VN") : "-";

    const getDaysRemaining = (tenant) => {
        if (tenant.status !== "trial") return null;
        const diff = Math.ceil(
            (new Date(tenant.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return diff;
    };

    /* ============ RENDER ============ */
    return (
        <Box className="p-4 md:p-6">
            {/* Header */}
            <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Quản lý thuê bao
                </Typography>
                <Box className="flex gap-2">
                    <Tooltip title="Làm mới">
                        <IconButton onClick={fetchTenants} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                    >
                        Thêm thuê bao
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            {loading ? (
                <Box className="flex justify-center py-12">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                                <TableCell><b>Mã</b></TableCell>
                                <TableCell><b>Tên thuê bao</b></TableCell>
                                <TableCell><b>Email chủ</b></TableCell>
                                <TableCell><b>Trạng thái</b></TableCell>
                                <TableCell><b>Ngày hết hạn</b></TableCell>
                                <TableCell><b>Còn lại</b></TableCell>
                                <TableCell><b>Số TK</b></TableCell>
                                <TableCell align="right"><b>Thao tác</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tenants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        Chưa có thuê bao nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tenants.map((t) => {
                                    const daysLeft = getDaysRemaining(t);
                                    return (
                                        <TableRow key={t._id} hover>
                                            <TableCell sx={{ fontFamily: "monospace", fontWeight: 600, color: "#2563eb" }}>
                                                {t.tenantCode}
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={600}>{t.tenantName}</Typography>
                                                {t.ownerName && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {t.ownerName}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{t.ownerEmail}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={STATUS_LABELS[t.status]?.label || t.status}
                                                    color={STATUS_LABELS[t.status]?.color || "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(t.trialEndDate)}</TableCell>
                                            <TableCell>
                                                {daysLeft !== null ? (
                                                    <Chip
                                                        label={daysLeft > 0 ? `${daysLeft} ngày` : "Hết hạn"}
                                                        color={daysLeft > 7 ? "success" : daysLeft > 0 ? "warning" : "error"}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell align="center">{t.userCount ?? "-"}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Gia hạn">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenExtend(t)}
                                                    >
                                                        <AutorenewIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => handleOpenEdit(t)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={t.status === "suspended" ? "Mở khoá" : "Khoá"}>
                                                    <IconButton
                                                        size="small"
                                                        color={t.status === "suspended" ? "success" : "warning"}
                                                        onClick={() => handleToggleStatus(t)}
                                                    >
                                                        {t.status === "suspended" ? (
                                                            <LockOpenIcon fontSize="small" />
                                                        ) : (
                                                            <LockIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xoá">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDelete(t)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ====== FORM DIALOG (Thêm / Sửa) ====== */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? "Chỉnh sửa thuê bao" : "Thêm thuê bao mới"}</DialogTitle>
                <DialogContent dividers>
                    <Box className="flex flex-col gap-4 pt-1">
                        <TextField
                            label="Họ và tên khách hàng"
                            value={form.ownerName}
                            onChange={(e) => setForm((p) => ({ ...p, ownerName: e.target.value }))}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Email *"
                            value={form.ownerEmail}
                            onChange={(e) => setForm((p) => ({ ...p, ownerEmail: e.target.value }))}
                            error={!!formErrors.ownerEmail}
                            helperText={formErrors.ownerEmail}
                            fullWidth
                            size="small"
                            disabled={!!editingId}
                        />
                        <TextField
                            label="Số điện thoại"
                            value={form.phone}
                            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                            fullWidth
                            size="small"
                        />
                        {!editingId && (
                            <TextField
                                label="Mật khẩu *"
                                type="password"
                                value={form.adminPassword}
                                onChange={(e) => setForm((p) => ({ ...p, adminPassword: e.target.value }))}
                                error={!!formErrors.adminPassword}
                                helperText={formErrors.adminPassword}
                                fullWidth
                                size="small"
                            />
                        )}
                        {!editingId && (
                            <TextField
                                label="Số ngày dùng thử *"
                                type="number"
                                value={form.trialDays}
                                onChange={(e) => setForm((p) => ({ ...p, trialDays: e.target.value }))}
                                onFocus={(e) => e.target.select()}
                                inputProps={{ min: 1, max: 365 }}
                                InputProps={{ endAdornment: <InputAdornment position="end">ngày</InputAdornment> }}
                                error={!!formErrors.trialDays}
                                helperText={formErrors.trialDays}
                                fullWidth
                                size="small"
                            />
                        )}
                        <TextField
                            label="Ghi chú"
                            value={form.notes}
                            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                            multiline
                            rows={2}
                            fullWidth
                            size="small"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)} disabled={submitting}>
                        Huỷ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={16} /> : null}
                    >
                        {editingId ? "Lưu" : "Tạo thuê bao"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ====== EXTEND TRIAL DIALOG ====== */}
            <Dialog open={openExtend} onClose={() => setOpenExtend(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Gia hạn dùng thử</DialogTitle>
                <DialogContent dividers>
                    <Box className="flex flex-col gap-4 pt-1">
                        <Typography variant="body2" color="text.secondary">
                            Thêm số ngày vào thời gian dùng thử hiện tại (hoặc tính từ hôm nay nếu đã hết hạn).
                        </Typography>
                        <TextField
                            label="Số ngày gia hạn"
                            type="number"
                            value={extendDays}
                            onChange={(e) => setExtendDays(parseInt(e.target.value) || 30)}
                            inputProps={{ min: 1, max: 365 }}
                            InputProps={{ endAdornment: <InputAdornment position="end">ngày</InputAdornment> }}
                            fullWidth
                            autoFocus
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExtend(false)} disabled={extendSubmitting}>
                        Huỷ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExtend}
                        disabled={extendSubmitting}
                        startIcon={extendSubmitting ? <CircularProgress size={16} /> : null}
                    >
                        Gia hạn
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ====== DELETE CONFIRM DIALOG ====== */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận xoá</DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mt: 1 }}>
                        Bạn sắp xoá thuê bao <strong>{deleteName}</strong> và toàn bộ tài khoản liên quan.
                        Thao tác này <strong>không thể hoàn tác</strong>.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} disabled={deleteSubmitting}>
                        Huỷ
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleteSubmitting}
                        startIcon={deleteSubmitting ? <CircularProgress size={16} /> : null}
                    >
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snack.severity}
                    onClose={() => setSnack((p) => ({ ...p, open: false }))}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
