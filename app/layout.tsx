import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi | Tư vấn pháp lý chuyên nghiệp",
  description:
    "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy, cung cấp dịch vụ tư vấn pháp lý, đại diện tố tụng, bảo vệ quyền lợi hợp pháp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased selection:bg-gold selection:text-white">
        {children}
      </body>
    </html>
  );
}
