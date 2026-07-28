# Deployment

Tài liệu này ghi lại toàn bộ quá trình triển khai (deploy) của dự án Storage & Forget.

Mục tiêu là giúp triển khai lại dự án nhanh chóng và lưu giữ kinh nghiệm thực tế.

---

# Frontend

Frontend được triển khai bằng GitHub Pages.

Ưu điểm:

- Miễn phí.
- Dễ sử dụng.
- Tự động cập nhật sau khi push lên GitHub.
- Phù hợp với web tĩnh.

---

# Backend

Backend sử dụng Supabase Edge Functions.

Vai trò:

- Gọi Gemini API.
- Bảo vệ API Key.
- Xử lý logic phía server.
- Trả kết quả về frontend.

---

# Vercel

Trong một giai đoạn phát triển, Vercel được sử dụng để triển khai backend.

Lý do:

- Có thể deploy dễ dàng ngay trên điện thoại.
- Không cần máy tính.
- Triển khai nhanh.
- Phù hợp khi chưa sử dụng Edge Functions.

---

# Supabase

Supabase được sử dụng cho:

- PostgreSQL Database.
- Storage.
- Edge Functions.

---

# Môi trường triển khai

- Frontend: GitHub Pages
- Backend: Supabase Edge Functions
- AI: Google Gemini
- Database: Supabase PostgreSQL
- Storage: Supabase Storage

---

# Kinh nghiệm

Tài liệu này sẽ ghi lại:

- Các bước deploy.
- Những lỗi từng gặp.
- Cách xử lý.
- Các lưu ý khi triển khai bằng điện thoại.
- Những kinh nghiệm để triển khai nhanh hơn.

---

# Ghi chú

Deployment sẽ được cập nhật khi kiến trúc triển khai của dự án thay đổi.