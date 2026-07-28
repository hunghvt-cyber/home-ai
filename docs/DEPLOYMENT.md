# Deployment

Storage & Forget được thiết kế để có thể triển khai hoàn toàn miễn phí và có thể quản lý ngay trên điện thoại.

Trong quá trình phát triển, kiến trúc triển khai đã thay đổi nhiều lần để cân bằng giữa chi phí, bảo mật và sự tiện lợi.

---

# Kiến trúc triển khai

```
GitHub
      │
      ▼
GitHub Pages
      │
      ▼
Browser
      │
      ▼
Supabase
      │
      ├── PostgreSQL
      ├── Storage
      └── Edge Functions
              │
              ▼
         Google Gemini
```

---

# Frontend

Frontend được deploy bằng GitHub Pages.

Ưu điểm:

- Miễn phí.
- Dễ cập nhật.
- Chỉ cần push lên GitHub.
- Không cần máy chủ riêng.
- Phù hợp với ứng dụng HTML, CSS và JavaScript.

---

# Backend

Backend sử dụng Supabase Edge Functions.

Vai trò:

- Gọi Gemini API.
- Bảo vệ API Key.
- Xử lý Prompt.
- Chuẩn hóa phản hồi.
- Làm cầu nối giữa Frontend và AI.

---

# Vercel

Trong một giai đoạn phát triển, Vercel được sử dụng để triển khai backend.

Lý do:

- Có thể deploy ngay trên điện thoại.
- Không cần máy tính.
- Thiết lập nhanh.
- Phù hợp khi chưa chuyển sang Supabase Edge Functions.

Sau khi kiến trúc ổn định, vai trò của Vercel giảm dần và được thay thế bởi Edge Functions.

---

# Supabase

Supabase là nền tảng trung tâm của ứng dụng.

Bao gồm:

- PostgreSQL Database
- Storage
- Edge Functions

Việc sử dụng cùng một nền tảng giúp đơn giản hóa việc quản lý.

---

# Quy trình triển khai

```
Code

↓

GitHub

↓

GitHub Pages

↓

Người dùng
```

Đối với AI:

```
Frontend

↓

Edge Function

↓

Gemini

↓

Frontend
```

---

# Quy trình cập nhật

Mỗi lần cập nhật:

1. Chỉnh sửa mã nguồn.
2. Commit lên GitHub.
3. GitHub Pages tự động cập nhật.
4. Nếu thay đổi Edge Function thì deploy lại trên Supabase.

---

# Triển khai bằng điện thoại

Một mục tiêu quan trọng của dự án là hạn chế phụ thuộc vào máy tính.

Trong quá trình phát triển:

- Quản lý GitHub trên điện thoại.
- Chỉnh sửa mã nguồn trên điện thoại hoặc máy tính bảng.
- Quản lý Supabase trên trình duyệt.
- Deploy Edge Functions khi cần.
- Sử dụng Vercel ở giai đoạn đầu để có thể triển khai nhanh mà không cần PC.

Điều này giúp việc phát triển linh hoạt hơn.

---

# Kinh nghiệm

Những kinh nghiệm rút ra:

- Frontend và Backend nên tách riêng.
- API Key không nên xuất hiện trong Frontend.
- GitHub Pages rất phù hợp cho web tĩnh.
- Edge Functions giúp đơn giản hóa việc bảo mật.
- Kiến trúc càng đơn giản thì càng dễ bảo trì.

---

# Có thể cải thiện

Trong tương lai có thể bổ sung:

- Môi trường Development và Production riêng.
- Tự động kiểm tra trước khi deploy.
- CI/CD hoàn chỉnh.
- Domain riêng.
- Theo dõi lỗi và hiệu năng.

---

# Tổng kết

Kiến trúc triển khai hiện tại đáp ứng tốt các mục tiêu của dự án:

- Chi phí thấp.
- Dễ triển khai.
- Dễ bảo trì.
- Có thể quản lý ngay trên điện thoại.
- Đủ khả năng mở rộng cho các phiên bản tiếp theo.