# Database

Tài liệu này mô tả toàn bộ kiến trúc dữ liệu của Storage & Forget.

---

# Database

Dự án sử dụng Supabase PostgreSQL.

Mục tiêu:

- Lưu thông tin đồ vật
- Quản lý vị trí
- Mở rộng dễ dàng trong tương lai

---

# Storage

Supabase Storage dùng để lưu hình ảnh.

Nguyên tắc:

- Chỉ lưu URL trong Database.
- Không lưu ảnh dạng Base64.
- Resize ảnh trước khi upload.
- Đặt tên file tránh trùng lặp.

---

# Tables

Chi tiết schema sẽ được cập nhật sau khi hoàn thiện phiên bản hiện tại.

Ví dụ:

- Items
- Rooms
- Categories (nếu có)
- ...

---

# Row Level Security (RLS)

Dự án sử dụng RLS để bảo vệ dữ liệu.

Các Policy sẽ được ghi lại tại đây để dễ tái sử dụng cho các dự án sau.

---

# SQL Scripts

Tài liệu này sẽ lưu:

- Script tạo bảng
- Script tạo Index
- Trigger
- Migration
- Những câu SQL hữu ích

---

# Kinh nghiệm

Trong quá trình phát triển sẽ ghi lại:

- Những lỗi thường gặp.
- Cách xử lý.
- Các quyết định thiết kế Database.

---

# Ghi chú

Mọi thay đổi liên quan đến Database nên được cập nhật vào tài liệu này.