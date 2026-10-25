import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://techhub-ltwnc.vercel.app"),
  title: {
    default: "TechHub - Siêu thị Công nghệ & Phụ kiện Đỉnh cao | LTWNC Tuần 8",
    template: "%s | TechHub",
  },
  description:
    "Cửa hàng thiết bị công nghệ âm thanh, máy tính chính hãng. Tích hợp NextAuth bảo mật 3 lớp (Middleware, Page Server Component, Server Actions), SEO chuẩn Google với Canonical URL, OpenGraph dynamic và JSON-LD Structured Data.",
  keywords: [
    "TechHub",
    "Tai nghe Sony",
    "AirPods Pro",
    "Bàn phím cơ Keychron",
    "NextAuth",
    "SEO Next.js",
    "JSON-LD",
    "LTWNC",
  ],
  authors: [{ name: "Nhóm Sinh Viên LTWNC", url: "https://techhub-ltwnc.vercel.app" }],
  creator: "Nhóm Sinh Viên LTWNC",
  publisher: "TechHub Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techhub-ltwnc.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://techhub-ltwnc.vercel.app",
    siteName: "TechHub Store",
    title: "TechHub - Siêu thị Công nghệ & Phụ kiện Đỉnh cao",
    description:
      "Tích hợp NextAuth bảo mật 3 lớp, SEO chuẩn Google với Canonical, OpenGraph và JSON-LD.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechHub - Siêu thị Công nghệ & Phụ kiện Đỉnh cao",
    description: "Tích hợp NextAuth, RBAC 2 vai trò và SEO tối ưu.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <SessionProvider>
          <div className="app-shell">
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
