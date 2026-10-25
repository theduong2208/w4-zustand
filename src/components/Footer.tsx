import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-title">TechHub</span>
            </div>
            <p className="footer-desc">
              Dự án Lập trình Web Nâng Cao (LTWNC) - Bài tập Tuần 8: Tích hợp NextAuth, Phân quyền RBAC Middleware & Server Actions, SEO Canonical, OpenGraph và JSON-LD.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Trang công khai (SEO)</h4>
            <ul className="footer-links">
              <li>
                <Link href="/">Trang chủ & Danh mục sản phẩm (Canonical & JSON-LD)</Link>
              </li>
              <li>
                <Link href="/products/p1">Chi tiết Sony WH-1000XM5 (OpenGraph & Schema Product)</Link>
              </li>
              <li>
                <Link href="/products/p2">Chi tiết AirPods Pro 2</Link>
              </li>
              <li>
                <Link href="/bao-cao">Báo cáo Tuần 8 & Bảng điểm Lighthouse</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Khu vực Bảo vệ (NextAuth & RBAC)</h4>
            <ul className="footer-links">
              <li>
                <Link href="/login">Đăng nhập (Email/Password & OAuth)</Link>
              </li>
              <li>
                <Link href="/profile">Hồ sơ người dùng (/profile - Yêu cầu Auth)</Link>
              </li>
              <li>
                <Link href="/admin">Quản trị viên (/admin - Yêu cầu Role Admin)</Link>
              </li>
              <li>
                <Link href="/unauthorized">Trang 403 Forbidden (/unauthorized)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TechHub LTWNC. Kiến trúc Next.js App Router + NextAuth + Zustand.</p>
          <div className="footer-badges">
            <span className="tech-badge">Next.js 14</span>
            <span className="tech-badge">NextAuth.js</span>
            <span className="tech-badge">Zustand</span>
            <span className="tech-badge">TypeScript</span>
            <span className="tech-badge">SEO 100/100</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
