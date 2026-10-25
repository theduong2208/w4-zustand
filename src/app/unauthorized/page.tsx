import Link from "next/link";
import { getAuthSession } from "@/lib/auth";

export const metadata = {
  title: "403 Forbidden - Không Đủ Quyền Truy Cập | TechHub",
  robots: { index: false, follow: false },
};

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: { reason?: string; from?: string };
}) {
  const session = await getAuthSession();
  const currentRole = session?.user?.role || "chưa đăng nhập";
  const attemptedPath = searchParams.from || "/admin";

  return (
    <div className="unauthorized-page-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon-wrapper">
          <span className="unauthorized-icon">🚫</span>
        </div>

        <span className="badge-403">HTTP 403 · ACCESS FORBIDDEN</span>
        <h1 className="unauthorized-title">Truy Cập Bị Từ Chối Bởi Hệ Thống RBAC</h1>

        <p className="unauthorized-desc">
          Bạn đang cố gắng truy cập vào đường dẫn bảo mật{" "}
          <code className="path-code">{attemptedPath}</code>. Tuy nhiên, hệ thống phân quyền (Role-Based Access Control) phát hiện phiên làm việc hiện tại không đáp ứng điều kiện.
        </p>

        {/* Diagnosis Box */}
        <div className="diagnosis-box">
          <h3 className="diagnosis-title">Thông Tin Chuẩn Đoán Quyền Truy Cập:</h3>
          <div className="diagnosis-grid">
            <div className="diagnosis-row">
              <span className="diagnosis-label">Trạng thái đăng nhập:</span>
              <span className="diagnosis-val font-semibold">
                {session?.user ? `Đã đăng nhập (${session.user.name})` : "Chưa đăng nhập (Khách vãng lai)"}
              </span>
            </div>
            <div className="diagnosis-row">
              <span className="diagnosis-label">Vai trò hiện tại (Current Role):</span>
              <span className={`diagnosis-val role-tag role-${currentRole}`}>
                {currentRole.toUpperCase()}
              </span>
            </div>
            <div className="diagnosis-row">
              <span className="diagnosis-label">Yêu cầu tối thiểu (Required):</span>
              <span className="diagnosis-val role-tag role-admin">
                ADMIN
              </span>
            </div>
            <div className="diagnosis-row">
              <span className="diagnosis-label">Cơ chế phát hiện & chặn:</span>
              <span className="diagnosis-val text-accent">
                Edge Middleware (src/middleware.ts) + Page Guard
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="unauthorized-actions">
          <Link href="/login?callbackUrl=/admin" className="btn-switch-admin">
            👑 Đăng nhập tài khoản Quản trị viên (Admin)
          </Link>
          <Link href="/" className="btn-return-home">
            🏠 Quay lại Trang chủ công khai
          </Link>
          <Link href="/profile" className="btn-view-profile">
            👤 Xem quyền hạn hồ sơ của tôi
          </Link>
        </div>
      </div>
    </div>
  );
}
