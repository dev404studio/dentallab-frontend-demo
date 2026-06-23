export const APP_ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  KE_TOAN: "ke-toan",
  NHAN_VIEN: "nhan-vien",
};

const normalizeRoleName = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, "-");

export const resolveAppRoleFromUser = (user) => {
  const roleFromToken = normalizeRoleName(user?.appRole);
  if (roleFromToken === APP_ROLES.SUPER_ADMIN) return APP_ROLES.SUPER_ADMIN;
  if (roleFromToken === APP_ROLES.ADMIN) return APP_ROLES.ADMIN;
  if (roleFromToken === APP_ROLES.KE_TOAN || roleFromToken === "ketoan") return APP_ROLES.KE_TOAN;
  if (roleFromToken === APP_ROLES.NHAN_VIEN || roleFromToken === "nhanvien") return APP_ROLES.NHAN_VIEN;

  const roleFromQuyen = normalizeRoleName(user?.quyenSuDung?.ten);
  if (roleFromQuyen === APP_ROLES.ADMIN) return APP_ROLES.ADMIN;
  if (roleFromQuyen === APP_ROLES.KE_TOAN || roleFromQuyen === "ketoan") return APP_ROLES.KE_TOAN;
  if (roleFromQuyen === APP_ROLES.NHAN_VIEN || roleFromQuyen === "nhanvien") return APP_ROLES.NHAN_VIEN;

  return APP_ROLES.NHAN_VIEN;
};

const doesPathMatch = (path, basePath) => {
  if (basePath === "/") return path === "/";
  if (basePath === "/don-hang" && path.startsWith("/donhang")) return true;
  return path === basePath || path.startsWith(`${basePath}/`);
};

export const hasRouteAccess = (user, path) => {
  const normalizedPath = String(path || "/").trim();

  if (normalizedPath.startsWith("/ho-so")) return true;

  const appRole = resolveAppRoleFromUser(user);

  // Super Admin có toàn quyền
  if (appRole === APP_ROLES.SUPER_ADMIN) return true;

  const permissions = user?.quyenSuDung?.permissions;

  // Fallback cho admin cũ chưa có permissions để tránh bị khóa
  if (appRole === APP_ROLES.ADMIN && (!permissions || permissions.length === 0)) {
    return true;
  }

  if (permissions && Array.isArray(permissions)) {
    return permissions.some((basePath) => doesPathMatch(normalizedPath, basePath));
  }

  return false;
};

export const getDefaultPathForUser = (user) => {
  const appRole = resolveAppRoleFromUser(user);

  // Super Admin vào trang quản lý tenant
  if (appRole === APP_ROLES.SUPER_ADMIN) return "/quan-ly-thue-bao";

  const permissions = user?.quyenSuDung?.permissions;
  if (permissions && Array.isArray(permissions) && permissions.length > 0) {
    return permissions[0];
  }

  if (appRole === APP_ROLES.ADMIN) return "/";

  return "/ho-so";
};