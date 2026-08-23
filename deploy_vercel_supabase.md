# HƯỚNG DẪN TRIỂN KHAI WEBSITE LÊN VERCEL VÀ DATABASE SUPABASE

Tài liệu này hướng dẫn chi tiết từng bước chuyển đổi CSDL từ SQLite sang **Supabase (PostgreSQL)**, triển khai ứng dụng Next.js lên **Vercel**, và **Cấu hình Trỏ Tên Miền Cá Nhân (Custom Domain)** đầy đủ.

---

## 📋 TỔNG QUAN CÁC BƯỚC THỰC HIỆN

```text
1. Lấy Connection String từ Supabase (Pooled & Direct URL)
   ↓
2. Cập nhật `prisma/schema.prisma` từ "sqlite" sang "postgresql"
   ↓
3. Chạy `prisma db push` & `db:seed` để tạo bảng và nạp dữ liệu lên Supabase
   ↓
4. Đẩy Codebase lên GitHub
   ↓
5. Tạo Dự án trên Vercel & Cấu hình Biến Môi trường (Environment Variables)
   ↓
6. Cấu hình Trỏ Tên Miền Cá Nhân (Custom Domain DNS Records)
   ↓
7. Kiểm tra & Hoàn tất Deploy
```

---

## BƯỚC 1: LẤY THÔNG TIN KẾT NỐI TỪ SUPABASE

1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập vào Project của bạn.
2. **CÁCH NGÁT & NHANH NHẤT**:
   - Nhìn lên **GÓC TRÊN BÊN PHẢI MÀN HÌNH** Supabase Dashboard.
   - Nhấp vào nút **`Connect`** (nút màu xanh/trắng ở góc trên).
   - Chọn tab **ORM** → Chọn **Prisma**.
   - Supabase sẽ tự động hiện sẵn 2 chuỗi kết nối dành riêng cho Prisma!

3. **Cách xem trong Settings**:
   - Hoặc ở menu bên trái: Chọn icon hình cái hũ CSDL (**Database 🛢️**) hoặc vào **Project Settings** → **Database**.
   - Cuộn xuống phần **Connection String**:
     - **Transaction Connection String (Dành cho `DATABASE_URL` trên Vercel)**:
       ```text
       postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
       ```
     - **Direct Connection String (Dành cho `DIRECT_URL` trên Vercel/Migration)**:
       ```text
       postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
       ```

---

## BƯỚC 2: CẬP NHẬT PRISMA SCHEMA CHO POSTGRESQL

Trong file [`prisma/schema.prisma`](file:///Users/thiemvv/Documents/website-luat/prisma/schema.prisma), thay đổi khối `datasource db`:

```prisma
// Trước (SQLite):
// datasource db {
//   provider = "sqlite"
//   url      = env("DATABASE_URL")
// }

// Sau (Supabase PostgreSQL):
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## BƯỚC 3: KHỞI TẠO BẢNG & NẠP DỮ LIỆU LÊN SUPABASE

1. Cập nhật file `.env` cục bộ trên máy để test kết nối:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-2026"
```

2. Chạy lệnh đẩy cấu trúc bảng lên Supabase:
   ```bash
   npx prisma db push
   ```

3. Chạy lệnh nạp dữ liệu mẫu ban đầu (Seed database):
   ```bash
   pnpm db:seed
   ```
   *(Tạo sẵn thông tin Luật sư, Menu, Bài viết và tài khoản Admin: `admin@lethingocloi.vn` / `Admin@123456`)*

---

## BƯỚC 4: ĐẨY CODE UP GITHUB

1. Khởi tạo và commit code lên GitHub (nếu chưa):
   ```bash
   git add .
   git commit -m "feat: prepare PostgreSQL & Vercel deployment setup"
   git push origin main
   ```

---

## BƯỚC 5: TRIỂN KHAI ỨNG DỤNG LÊN VERCEL

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Nhấp **Add New...** → **Project** → Chọn repository `website-luat`.
3. Trong màn hình **Configure Project**:
   - **Framework Preset**: *Next.js* (Tự động nhận diện).
   - **Build Command**: `prisma generate && next build`
   - **Environment Variables**: Thêm các biến sau:

| Tên Biến | Giá Trị | Mô Tả |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@... pooler.supabase.com:6543/postgres?pgbouncer=true` | Chuỗi kết nối qua Supabase Pooler |
| `DIRECT_URL` | `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres` | Chuỗi kết nối trực tiếp Supabase DB |
| `JWT_SECRET` | `thay-bang-chuoi-bao-mat-ramdom` | Secret Key mã hóa JWT đăng nhập Admin |
| `GEMINI_API_KEY` | `AIzaSy...` *(Nếu có)* | API Key dịch vụ Gemini AI |

4. Nhấn **Deploy**.
5. Vercel sẽ tự động cài đặt dependencies, biên dịch Next.js và cấp cho bạn đường dẫn URL mặc định dạng: `https://website-luat-su-le-thi-ngoc-loi.vercel.app`.

---

## BƯỚC 6: HƯỚNG DẪN TRỎ TÊN MIỀN CÁ NHÂN (CUSTOM DOMAIN)

Giả sử tên miền cá nhân của bạn là: **`luatsungocloi.vn`** (mua tại PA Việt Nam, iNET, Mắt Bão, Cloudflare, v.v.).

### 1. Thêm Tên Miền vào Vercel Project
1. Vào Vercel Dashboard → Chọn Dự án của bạn → **Settings** → **Domains**.
2. Nhập tên miền: `luatsungocloi.vn` → Nhấn **Add**.
3. Vercel sẽ đề xuất thêm cả dạng `www.luatsungocloi.vn` (tự động chuyển hướng về tên miền gốc).

---

### 2. Cấu hình Bản ghi DNS (DNS Records) tại Nhà cung cấp Tên miền

Đăng nhập vào Trang quản lý Tên miền của nhà cung cấp bạn đã mua (PA Việt Nam, iNET, Mắt Bão...) và tạo 2 bản ghi sau:

#### 🔹 Bản ghi 1: Dành cho Tên miền Gốc (`luatsungocloi.vn`)
* **Loại Bản Ghi (Type)**: `A`
* **Tên / Host (Name)**: `@` *(hoặc để trống tùy nhà cung cấp)*
* **Giá trị / Địa chỉ IP (Value / Target)**: `76.76.21.21`
* **TTL**: `Auto` hoặc `3600`

#### 🔹 Bản ghi 2: Dành cho Subdomain WWW (`www.luatsungocloi.vn`)
* **Loại Bản Ghi (Type)**: `CNAME`
* **Tên / Host (Name)**: `www`
* **Giá trị / Target (Value / Destination)**: `cname.vercel-dns.com`
* **TTL**: `Auto` hoặc `3600`

---

### 3. Tự động Cấp Chứng chỉ Bảo mật SSL (HTTPS)
* Sau khi bạn lưu 2 bản ghi DNS trên, Vercel sẽ tự động xác minh DNS (thường mất từ 1 – 15 phút).
* Ngay sau khi xác minh thành công, Vercel sẽ **tự động cấp Chứng chỉ SSL miễn phí (HTTPS)** bảo mật tuyệt đối cho tên miền của bạn.
* Mọi truy cập HTTP sẽ tự động được chuyển hướng an toàn sang HTTPS (`https://luatsungocloi.vn`).

---

## 🛠️ CÁC LƯU Ý KHI QUẢN TRỊ TRÊN SUPABASE & VERCEL

1. **Kiểm tra trạng thái DNS**:
   - Bạn có thể kiểm tra xem tên miền đã nhận IP Vercel chưa qua công cụ trực tuyến: [https://dnschecker.org](https://dnschecker.org) (gõ tên miền và chọn bản ghi `A`).
2. **Cập nhật Dữ liệu về sau**:
   - Bạn có thể vào trang quản trị Admin (`/admin/login`) trực tiếp trên tên miền chính chủ để chỉnh sửa thông tin.
   - Dữ liệu được lưu trữ an toàn, tức thì trên Supabase PostgreSQL Cloud.
