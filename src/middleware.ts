import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;
    const role = token?.role;

    // 🛡️ Lớp bảo vệ 1: Edge Middleware RBAC (Role-Based Access Control)
    // Nếu truy cập route dành riêng cho Quản trị viên (/admin/*)
    if (pathname.startsWith("/admin")) {
      if (role !== "admin") {
        // Đã đăng nhập nhưng không phải admin -> chuyển hướng sang /unauthorized
        const unauthorizedUrl = new URL("/unauthorized", req.url);
        unauthorizedUrl.searchParams.set("reason", "admin_required");
        unauthorizedUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Xác thực sơ bộ: Chỉ cho phép đi tiếp nếu có token đăng nhập hợp lệ
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Áp dụng middleware cho các route cần phân quyền và bảo vệ
export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
};
