# Project Architecture

Tài liệu này mô tả kiến trúc tổng thể của dự án Storage & Forget.

Mục tiêu là giúp nhanh chóng hiểu cấu trúc source code và luồng hoạt động của ứng dụng.

---

# Tổng quan

Storage & Forget là một web app chạy hoàn toàn trên trình duyệt.

Frontend được xây dựng bằng HTML, CSS và JavaScript thuần.

Backend sử dụng Supabase Database, Supabase Storage và Supabase Edge Functions.

AI được cung cấp bởi Google Gemini thông qua Edge Function.

---

# Kiến trúc tổng thể

```
User
    │
    ▼
Frontend (HTML/CSS/JavaScript)
    │
    ├──────────────► Supabase Database
    │
    ├──────────────► Supabase Storage
    │
    └──────────────► Edge Function
                        │
                        ▼
                   Google Gemini API
```

---

# Nguyên tắc tổ chức source code

- Mỗi thư mục chỉ đảm nhiệm một chức năng.
- UI và xử lý dữ liệu tách riêng.
- AI tách riêng khỏi Database.
- Các module độc lập, hạn chế phụ thuộc lẫn nhau.
- Ưu tiên JavaScript thuần, không sử dụng framework.

---

# Cấu trúc thư mục

> Nội dung sẽ được cập nhật sau khi hoàn thành quá trình refactor.

---

# Luồng hoạt động

> Sẽ bổ sung ở các phiên bản tiếp theo.

---

# Ghi chú

Tài liệu này sẽ được cập nhật khi cấu trúc project thay đổi.