"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { testServerActionGuardAction, ActionResult } from "@/actions/adminActions";

export default function SecurityLayersShowcase() {
  const { data: session } = useSession();
  const [testing, setTesting] = useState(false);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);

  const handleTestServerAction = async () => {
    setTesting(true);
    setActionResult(null);
    try {
      const res = await testServerActionGuardAction();
      setActionResult(res);
    } catch (err: unknown) {
      setActionResult({
        success: false,
        statusCode: 500,
        error: err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định",
        message: "Lỗi kết nối Server Action",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <section className="security-showcase-section">
      <div className="section-header text-center">
        <span className="section-badge badge-security">BẢO MẬT 3 LỚP (DEFENSE IN DEPTH)</span>
        <h2 className="section-title">Kiến Trúc Phân Quyền NextAuth & Server Actions</h2>
        <p className="section-desc">
          Triển khai mô hình Zero-Trust: Ngăn chặn truy cập trái phép từ Edge Network, Server Component đến các tác vụ nhạy cảm trên Server Action.
        </p>
      </div>

      <div className="layers-grid">
        {/* Layer 1: Middleware */}
        <div className="layer-card">
          <div className="layer-card-badge">LỚP 1 · EDGE NETWORK</div>
          <div className="layer-icon-wrapper icon-middleware">🛡️</div>
          <h3 className="layer-title">Next.js Middleware</h3>
          <p className="layer-file"><code>src/middleware.ts</code></p>
          <p className="layer-desc">
            Chặn và phân tích JWT Token ngay tại Edge Server trước khi request tới trang.
            Nếu người dùng chưa đăng nhập hoặc không mang vai trò <code>admin</code> khi vào <code>/admin/*</code>, Middleware sẽ lập tức chuyển hướng (Fast-Fail) về <code>/login</code> hoặc <code>/unauthorized</code>.
          </p>
          <div className="layer-status-pill status-active">
            <span className="status-dot" /> Bảo vệ <code>/admin/*</code> & <code>/profile</code>
          </div>
        </div>

        {/* Layer 2: Page Server Component */}
        <div className="layer-card">
          <div className="layer-card-badge">LỚP 2 · SERVER COMPONENT</div>
          <div className="layer-icon-wrapper icon-page">📄</div>
          <h3 className="layer-title">Page & Layout Guard</h3>
          <p className="layer-file"><code>src/app/admin/page.tsx</code></p>
          <p className="layer-desc">
            Xác thực lại phiên đăng nhập trên Server qua hàm <code>getAuthSession()</code>.
            Ngăn chặn triệt để tình trạng bypass Middleware (ví dụ dev server rewrite). Kiểm tra <code>session.user.role === 'admin'</code> để quyết định render dữ liệu nhạy cảm hay gọi <code>redirect()</code>.
          </p>
          <div className="layer-status-pill status-active">
            <span className="status-dot" /> Kiểm tra SSR Session & Strict Types
          </div>
        </div>

        {/* Layer 3: Server Action */}
        <div className="layer-card">
          <div className="layer-card-badge">LỚP 3 · MUTATION SECURITY</div>
          <div className="layer-icon-wrapper icon-action">⚡</div>
          <h3 className="layer-title">Server Action RBAC</h3>
          <p className="layer-file"><code>src/actions/adminActions.ts</code></p>
          <p className="layer-desc">
            Mỗi hàm Server Action đều kiểm tra quyền hạn độc lập trước khi thao tác dữ liệu.
            Dù kẻ tấn công có giả mạo request POST bằng cURL hay Postman đến Action ID, Server Action vẫn chặn đứng với mã lỗi <code>403 Forbidden</code>.
          </p>
          <div className="layer-status-pill status-active">
            <span className="status-dot" /> Zero-Trust Mutation Barrier
          </div>
        </div>
      </div>

      {/* Interactive Testing Box */}
      <div className="interactive-test-box">
        <div className="interactive-header">
          <div className="interactive-title-group">
            <span className="interactive-icon">🧪</span>
            <div>
              <h4 className="interactive-title">Thử nghiệm trực tiếp: Kiểm tra Server Action RBAC Guard</h4>
              <p className="interactive-sub">
                Trạng thái hiện tại:{" "}
                {session?.user ? (
                  <span className="auth-current-state">
                    Đã đăng nhập: <strong>{session.user.name}</strong> (Vai trò:{" "}
                    <code className={`role-pill role-${session.user.role}`}>
                      {session.user.role}
                    </code>
                    )
                  </span>
                ) : (
                  <span className="auth-current-state text-warning">
                    Chưa đăng nhập (Khách ẩn danh)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="interactive-buttons">
            <button
              onClick={handleTestServerAction}
              disabled={testing}
              className="btn-test-action"
            >
              {testing ? "Đang gọi Server Action..." : "▶ Kích hoạt Server Action"}
            </button>
            {!session && (
              <Link href="/login" className="btn-test-login">
                Đăng nhập để test
              </Link>
            )}
          </div>
        </div>

        {/* Live Result Feedback */}
        {actionResult && (
          <div
            className={`action-result-box ${
              actionResult.success ? "action-result-success" : "action-result-error"
            }`}
          >
            <div className="result-header">
              <span className="result-badge">
                Status: {actionResult.statusCode} {actionResult.success ? "OK" : "REJECTED"}
              </span>
              <span className="result-caller">
                Vai trò gửi lệnh: <strong>{actionResult.callerRole || "Khách ẩn danh"}</strong>
              </span>
            </div>
            <p className="result-message">
              {actionResult.success ? actionResult.message : actionResult.error}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
