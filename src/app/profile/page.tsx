import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import SecurityLayersShowcase from "@/components/SecurityLayersShowcase";

export const metadata = {
  title: "Hồ Sơ & Phân Quyền Tài Khoản | TechHub",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const role = session.user.role;
  const isAdmin = role === "admin";

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={session.user.image || "https://picsum.photos/seed/default-avatar/120/120"}
            alt={session.user.name || "Avatar"}
            className="profile-avatar"
          />
          <div className="profile-info-wrap">
            <div className="profile-title-row">
              <h1 className="profile-user-name">{session.user.name}</h1>
              <span className={`profile-role-badge role-${role}`}>
                {role === "admin" ? "👑 QUẢN TRỊ VIÊN (ADMIN)" : "👤 KHÁCH HÀNG (USER)"}
              </span>
            </div>
            <p className="profile-user-email">{session.user.email}</p>
            <p className="profile-badge-note">
              Phiên đăng nhập JWT an toàn, phân quyền qua NextAuth và TypeScript strict type
            </p>
          </div>
        </div>

        {/* Permissions & Session metadata table */}
        <div className="profile-section">
          <h2 className="profile-section-heading">Thông Số Kỹ Thuật Phiên Làm Việc (Session Types)</h2>
          <div className="session-spec-grid">
            <div className="spec-card">
              <span className="spec-label">Mã định danh (User ID):</span>
              <code className="spec-value">{session.user.id}</code>
            </div>
            <div className="spec-card">
              <span className="spec-label">Vai trò trong Session (Role):</span>
              <code className={`spec-value font-bold role-text-${role}`}>{session.user.role}</code>
            </div>
            <div className="spec-card">
              <span className="spec-label">Quyền truy cập /admin:</span>
              <span className={`spec-perm ${isAdmin ? "perm-allowed" : "perm-denied"}`}>
                {isAdmin ? "✓ Cho phép toàn quyền" : "✕ Bị chặn bởi Middleware & Guard"}
              </span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Quyền chạy Server Action Admin:</span>
              <span className={`spec-perm ${isAdmin ? "perm-allowed" : "perm-denied"}`}>
                {isAdmin ? "✓ Cho phép cập nhật/xóa" : "✕ Bị từ chối (403 Forbidden)"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Route Access Testing */}
        <div className="profile-routes-test">
          <h2 className="profile-section-heading">Thử Nghiệm Phân Quyền Định Tuyến</h2>
          <div className="routes-test-grid">
            <div className="route-test-card">
              <div className="route-header">
                <span className="route-badge badge-public">PUBLIC</span>
                <span className="route-path">/ (Trang chủ)</span>
              </div>
              <p className="route-desc">Tất cả mọi người đều có quyền xem danh mục sản phẩm.</p>
              <Link href="/" className="btn-test-route">
                Vào Trang chủ →
              </Link>
            </div>

            <div className="route-test-card">
              <div className="route-header">
                <span className="route-badge badge-admin">ADMIN ONLY</span>
                <span className="route-path">/admin (Quản trị viên)</span>
              </div>
              <p className="route-desc">
                {isAdmin
                  ? "Tài khoản của bạn là Admin, có thể truy cập hợp lệ."
                  : "Tài khoản của bạn là User, sẽ bị Middleware chặn và chuyển hướng về /unauthorized."}
              </p>
              <Link
                href="/admin"
                className={`btn-test-route ${!isAdmin ? "btn-test-denied" : ""}`}
              >
                {isAdmin ? "Vào Bảng Admin →" : "Thử nghiệm bị chặn vào /admin →"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Server Action Test for Current Session */}
      <SecurityLayersShowcase />
    </div>
  );
}
