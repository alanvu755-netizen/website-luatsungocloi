# 🚀 HƯỚNG DẪN DEPLOY WEBSITE CẦM TAY CHỈ VIỆC (DỄ HIỂU NHẤT)

Tài liệu này được viết theo dạng **Danh sách việc cần làm (Checklist)**. Bạn chỉ cần làm chính xác theo từng bước bên dưới từ trên xuống dưới, **không cần phải suy nghĩ phức tạp**.

---

## 📌 PHẦN 1: TẠO DATABASE TRÊN SUPABASE (3 phút)

### Bước 1.1: Tạo dự án Supabase
1. Mở trang web: **[https://supabase.com](https://supabase.com)**
2. Nhấp nút **Sign In** (hoặc **Start your project**), chọn **Continue with GitHub** để đăng nhập cho nhanh.
3. Nhấp nút màu xanh **`New Project`**.
4. Điền các ô như sau:
   - **Name**: Gõ `website-luat`
   - **Database Password**: Nhập mật khẩu bạn muốn (Ví dụ: `LuatSuNgocLoi2026@`) ⚠️ **LƯU MẬT KHẨU NÀY LẠI CHÚT DÙNG!**
   - **Region**: Chọn `Singapore (ap-southeast-1)`
5. Nhấp nút màu xanh **`Create new project`** bên dưới. Chờ khoảng 1-2 phút cho hệ thống tạo xong.

### Bước 1.2: Lấy 2 chuỗi kết nối (Connection String)
1. Nhìn lên **góc trên bên phải màn hình Supabase**, nhấp vào nút **`Connect`** (nút màu xanh/trắng).
2. Một bảng hiện ra → Nhấp vào tab **ORM** → Chọn **Prisma**.
3. Bạn sẽ thấy 2 khung chứa đoạn chữ dài. Hãy copy 2 đoạn chữ đó ra **Ghi chú (Notepad)**:
   - **Đoạn 1 (Transaction pooler)**: Dạng `postgresql://postgres.xxx:MẬT_KHẨU@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - **Đoạn 2 (Direct connection)**: Dạng `postgresql://postgres.xxx:MẬT_KHẨU@db.xxx.supabase.co:5432/postgres`

⚠️ **LƯU Ý**: Trong 2 đoạn vừa copy, chỗ chữ `[YOUR-PASSWORD]` bạn hãy **thay bằng đúng Mật khẩu** bạn đã đặt ở Bước 1.1!

---

## 📌 PHẦN 2: CHẠY LỆNH ĐẨY DỮ LIỆU LÊN SUPABASE (2 phút)

### Bước 2.1: Mở file `.env` trong máy tính
1. Trong VSCode / Antigravity editor, mở file **`.env`** (nằm ở ngoài cùng của dự án `website-luat`).
2. Xóa sạch nội dung cũ và dán 3 dòng này vào (nhớ thay 2 chuỗi của bạn ở Bước 1.2 vào):

```env
DATABASE_URL="ĐOẠN_1_BẠN_ĐÃ_REPLACE_PASS_Ở_BƯỚC_1.2"
DIRECT_URL="ĐOẠN_2_BẠN_ĐÃ_REPLACE_PASS_Ở_BƯỚC_1.2"
JWT_SECRET="LuatSuNgocLoiSecretJWTKey2026"
```

3. Bấm `Cmd + S` để lưu file `.env`.

### Bước 2.2: Chạy lệnh Terminal trong máy
Mở Terminal trên máy Mac của bạn, dán đúng lệnh này và bấm **Enter**:

```bash
export PATH=~/.local/bin:$PATH && cd /Users/thiemvv/Documents/website-luat && npx prisma db push && pnpm db:seed
```

Khi Terminal báo chữ xanh `✔ Generated Prisma Client` và `Seeding finished.`, nghĩa là database trên Supabase đã có đủ dữ liệu!

---

## 📌 PHẦN 3: ĐẨY CODE LÊN GITHUB (2 phút)

### Bước 3.1: Tạo Kho chứa (Repository) mới trên GitHub
1. Mở trình duyệt truy cập: **[https://github.com/new](https://github.com/new)** (Đăng nhập GitHub).
2. Ô **Repository name**: Gõ `website-luat`
3. Nhấp nút màu xanh **`Create repository`** ở dưới cùng.
4. Copy đường dẫn link HTTPS vừa tạo (dạng: `https://github.com/TÊN_BẠN/website-luat.git`).

### Bước 3.2: Chạy lệnh kết nối và đẩy code
Mở Terminal, thay link GitHub của bạn vào lệnh bên dưới rồi dán và nhấn **Enter**:

```bash
cd /Users/thiemvv/Documents/website-luat && git init && git add . && git commit -m "first commit" && git branch -M main && git remote add origin LINK_GITHUB_CỦA_BẠN && git push -u origin main
```

*(Ví dụ: thay `LINK_GITHUB_CỦA_BẠN` bằng `https://github.com/thiemvv/website-luat.git`)*.

---

## 📌 PHẦN 4: UỐNG CÀ PHÊ VÀ DEPLOY LÊN VERCEL (3 phút)

### Bước 4.1: Import dự án vào Vercel
1. Truy cập: **[https://vercel.com](https://vercel.com)**
2. Nhấp **Log In** → chọn **Continue with GitHub**.
3. Nhấp nút **`Add New...`** (góc trên bên phải) → chọn **`Project`**.
4. Tìm tên repository **`website-luat`** trong danh sách → Nhấp nút **`Import`** bên cạnh.

### Bước 4.2: Nhập Biến Môi Trường (Environment Variables)
Tại màn hình cấu hình dự án, cuộn xuống phần **Environment Variables**:

1. Ô **Name**: gõ `DATABASE_URL`
   - Ô **Value**: dán **Đoạn 1** (chuỗi pooler cổng 6543 có password) vào → Nhấp nút **`Add`**.

2. Ô **Name**: gõ `DIRECT_URL`
   - Ô **Value**: dán **Đoạn 2** (chuỗi direct cổng 5432 có password) vào → Nhấp nút **`Add`**.

3. Ô **Name**: gõ `JWT_SECRET`
   - Ô **Value**: gõ `LuatSuNgocLoiSecretJWTKey2026` → Nhấp nút **`Add`**.

### Bước 4.3: Bấm Deploy!
Nhấp nút màu đen **`Deploy`** ở dưới cùng.
Chờ khoảng 1-2 phút, màn hình sẽ hiện hoa tuyết pháo hoa báo hiệu **Congratulations!** 🎉

---

## 📌 PHẦN 5: TRỎ TÊN MIỀN `luatsungocloi.vn` VỀ WEBSITE (2 phút)

### Bước 5.1: Gắn tên miền vào Vercel
1. Ngay tại màn hình Vercel vừa Deploy xong, nhấp **`Continue to Dashboard`**.
2. Nhấp vào tab **Settings** (ở thanh menu trên) → chọn mục **Domains** ở cột trái.
3. Tại ô **Add Domain**: Gõ `luatsungocloi.vn` → Nhấp nút **`Add`**.
4. Vercel sẽ tự hiện câu hỏi thêm dạng `www.luatsungocloi.vn`, bạn bấm **Add** luôn.

### Bước 5.2: Nhập 2 dòng ở Nhà Cung Cấp Tên Miền
Đăng nhập vào trang Quản lý Tên miền (nơi bạn mua tên miền `luatsungocloi.vn` như PA Việt Nam, iNET, Mắt Bão, v.v.):

Vào phần **Quản lý bản ghi DNS** → Nhập đúng **2 dòng** sau:

| Dòng | Loại (Type) | Tên (Host/Name) | Giá trị (Value/Target) |
| :---: | :---: | :---: | :---: |
| **1** | **`A`** | **`@`** *(hoặc để trống)* | **`76.76.21.21`** |
| **2** | **`CNAME`** | **`www`** | **`cname.vercel-dns.com`** |

Bấm **Lưu bản ghi**.

---

## 🎉 HOÀN THÀNH 100%!

Sau 2–5 phút, bạn mở điện thoại hoặc máy tính lên gõ:
👉 **`https://luatsungocloi.vn`**

Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi của bạn đã chính thức chạy trên Internet toàn cầu với chứng chỉ bảo mật khoá xanh HTTPS!
