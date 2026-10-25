"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useFavoritesStore } from "@/store/favoritesStore";
import FavoritesDrawer from "./FavoritesDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Zustand selector for favorite count
  const favoriteCount = useFavoritesStore((s) => s.favoriteItems.length);

  const role = session?.user?.role;
  const isAdmin = role === "admin";

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">⚡</span>
            <div className="logo-text-group">
              <span className="logo-title">TechHub</span>
              <span className="logo-subtitle">LTWNC · Tuần 8</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="navbar-nav">
            <Link
              href="/"
              className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}
            >
              Trang chủ
            </Link>
            <Link
              href="/#products"
              className={`nav-link ${pathname === "/#products" ? "nav-link-active" : ""}`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/admin"
              className={`nav-link ${pathname.startsWith("/admin") ? "nav-link-active" : ""} ${
                isAdmin ? "nav-link-admin" : ""
              }`}
            >
              Quản trị Admin
              {isAdmin && <span className="admin-pill">ADMIN</span>}
            </Link>
            <Link
              href="/bao-cao"
              className={`nav-link ${pathname === "/bao-cao" ? "nav-link-active" : ""}`}
            >
              Báo cáo Tuần 8
            </Link>
          </nav>

          {/* Actions & User profile */}
          <div className="navbar-actions">
            {/* Favorites Drawer button (Zustand) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="fav-toggle-btn"
              title="Danh sách yêu thích (Zustand Store)"
              aria-label="Xem sản phẩm yêu thích"
            >
              <span className="heart-icon">♥</span>
              <span className="fav-label">Yêu thích</span>
              {favoriteCount > 0 && <span className="fav-badge">{favoriteCount}</span>}
            </button>

            {/* Auth section */}
            {status === "loading" ? (
              <div className="auth-loading-spinner" />
            ) : session?.user ? (
              <div className="user-menu-wrapper">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="user-profile-button"
                  aria-expanded={isUserMenuOpen}
                >
                  <img
                    src={session.user.image || "https://picsum.photos/seed/default-avatar/80/80"}
                    alt={session.user.name || "Avatar"}
                    className="user-avatar"
                  />
                  <div className="user-meta">
                    <span className="user-name">{session.user.name?.split(" ")[0]}</span>
                    <span className={`role-badge role-${role}`}>{role?.toUpperCase()}</span>
                  </div>
                  <span className="chevron-icon">▾</span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-menu" onClick={() => setIsUserMenuOpen(false)}>
                    <div className="dropdown-header">
                      <p className="dropdown-name">{session.user.name}</p>
                      <p className="dropdown-email">{session.user.email}</p>
                      <div className="dropdown-role-tag">
                        Vai trò: <strong>{role === "admin" ? "Quản trị viên (Admin)" : "Khách hàng (User)"}</strong>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link href="/profile" className="dropdown-item">
                      👤 Hồ sơ & Phân quyền
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="dropdown-item dropdown-item-admin">
                        🛡️ Bảng điều khiển Admin
                      </Link>
                    )}
                    <Link href="/bao-cao" className="dropdown-item">
                      📑 Xem Báo cáo & Điểm Lighthouse
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="dropdown-item dropdown-item-danger"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="login-btn-primary">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Zustand Favorites Drawer */}
      <FavoritesDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
