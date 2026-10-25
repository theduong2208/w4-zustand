"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam ? "Đăng nhập thất bại. Vui lòng thử lại!" : ""
  );

  // Email / Password submit handler
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMsg("Đã xảy ra lỗi hệ thống khi kết nối xác thực.");
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Quick Login for testing Admin & User accounts
  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    setErrorMsg("");
    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: demoEmail,
        password: demoPass,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMsg("Đã xảy ra lỗi đăng nhập nhanh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Card Header */}
        <div className="login-header">
          <Link href="/" className="login-brand">
            <span className="login-logo-icon">⚡</span>
            <span className="login-brand-name">TechHub</span>
          </Link>
          <h1 className="login-title">Đăng Nhập Tài Khoản</h1>
          <p className="login-subtitle">
            Hệ thống xác thực đa phương thức NextAuth với phân quyền vai trò (Admin & User)
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="login-error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Accounts Quick Sign-In */}
        <div className="demo-accounts-box">
          <div className="demo-box-label">⚡ LỐI TẮT ĐĂNG NHẬP 1-CLICK (DÙNG ĐỂ CHẤM ĐIỂM / TEST):</div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@techhub.vn", "Admin@123")}
              disabled={loading}
              className="btn-demo-account btn-demo-admin"
              title="Đăng nhập ngay vai trò Quản trị viên (Admin)"
            >
              <div className="demo-account-icon">👑</div>
              <div className="demo-account-text">
                <span className="demo-account-role">ADMINISTRATOR</span>
                <span className="demo-account-email">admin@techhub.vn</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("user@techhub.vn", "User@123")}
              disabled={loading}
              className="btn-demo-account btn-demo-user"
              title="Đăng nhập ngay vai trò Khách hàng (User)"
            >
              <div className="demo-account-icon">👤</div>
              <div className="demo-account-text">
                <span className="demo-account-role">REGULAR USER</span>
                <span className="demo-account-email">user@techhub.vn</span>
              </div>
            </button>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleCredentialsSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Địa chỉ Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@techhub.vn hoặc user@techhub.vn"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <span className="form-hint">Mật khẩu mẫu: Admin@123 / User@123</span>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit-login"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập với Email & Mật khẩu"}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span className="divider-line" />
          <span className="divider-text">Hoặc đăng nhập với OAuth</span>
          <span className="divider-line" />
        </div>

        {/* OAuth Buttons */}
        <div className="oauth-buttons-container">
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            disabled={loading}
            className="btn-oauth btn-github"
          >
            <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Tiếp tục với GitHub OAuth</span>
          </button>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            disabled={loading}
            className="btn-oauth btn-google"
          >
            <svg className="oauth-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Tiếp tục với Google OAuth</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="login-footer">
          <Link href="/" className="back-to-home-link">
            ← Quay lại Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
