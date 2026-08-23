import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi | Tư vấn pháp lý chuyên nghiệp",
  description:
    "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy, cung cấp dịch vụ tư vấn pháp lý, đại diện tố tụng, bảo vệ quyền lợi hợp pháp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`}>
      <body className="antialiased bg-white text-slate-800 selection:bg-navy selection:text-white">
        {children}
      </body>
    </html>
  );
}
