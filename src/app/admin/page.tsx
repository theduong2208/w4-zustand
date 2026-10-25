import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getAllProducts } from "@/lib/productsData";
import AdminProductManager from "@/components/AdminProductManager";

export const metadata = {
  title: "Bảng Điều Khiển Quản Trị Viên (Admin) | TechHub",
  description: "Trang quản trị bảo vệ nghiêm ngặt bằng Middleware và Server Component Guard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  // 🛡️ LỚP BẢO VỆ 2: Kiểm tra phiên đăng nhập và vai trò ngay tại Server Component (Page Guard)
  const session = await getAuthSession();

  // 1. Nếu chưa đăng nhập -> chuyển hướng về Login
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // 2. Nếu đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> chuyển hướng về trang 403 /unauthorized
  if (session.user.role !== "admin") {
    redirect("/unauthorized?reason=admin_required&from=/admin");
  }

  const products = getAllProducts();

  return (
    <div className="admin-page-container">
      {/* Admin Header */}
      <div className="admin-header-card">
        <div className="admin-header-main">
          <div className="admin-badge-row">
            <span className="badge-role-admin">👑 VAI TRÒ QUẢN TRỊ VIÊN (ADMIN)</span>
            <span className="badge-guard-status">✓ Đã vượt qua Middleware & Page Guard</span>
          </div>
          <h1 className="admin-page-title">Bảng Điều Khiển Quản Trị Hệ Thống</h1>
          <p className="admin-page-subtitle">
            Xin chào <strong>{session.user.name}</strong> ({session.user.email}). Bạn đang truy cập vào khu vực giới hạn đặc quyền cao nhất của TechHub.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link href="/profile" className="btn-admin-subaction">
            👤 Xem Hồ sơ & Token
          </Link>
          <Link href="/bao-cao" className="btn-admin-subaction">
            📑 Báo cáo Tuần 8
          </Link>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-products">📦</div>
          <div className="stat-content">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Tổng số sản phẩm đang quản lý</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-security">🛡️</div>
          <div className="stat-content">
            <span className="stat-value">3 / 3 Lớp</span>
            <span className="stat-label">Middleware, Page SSR, Server Actions</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-role">👑</div>
          <div className="stat-content">
            <span className="stat-value font-mono">admin</span>
            <span className="stat-label">Session User Role (TypeScript Strict)</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-session">🔑</div>
          <div className="stat-content">
            <span className="stat-value text-sm font-mono truncate">{session.user.id}</span>
            <span className="stat-label">User ID định danh trong JWT</span>
          </div>
        </div>
      </div>

      {/* Product Management with Server Actions */}
      <AdminProductManager
        initialProducts={products}
        adminName={session.user.name || "Admin"}
      />
    </div>
  );
}
