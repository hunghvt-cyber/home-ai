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
      ├──────────────────────┐
      ▼                      ▼
Supabase               Vercel Serverless Function
      │                      │
PostgreSQL + Storage         ▼
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

Backend AI sử dụng Vercel Serverless Function (`api/gemini.js`).

Vai trò:

- Gọi Gemini API.
- Bảo vệ API Key.
- Xử lý Prompt.
- Chuẩn hóa phản hồi.
- Làm cầu nối giữa Frontend và AI.

---

# Vercel

Vercel là nền tảng chính để triển khai backend AI.

Lý do:

- Có thể deploy ngay trên điện thoại, không cần máy tính.
- Thiết lập nhanh, chỉ cần push lên GitHub là tự deploy.
- Dashboard quản lý biến môi trường (API Key) dễ dùng trên trình duyệt điện thoại.

Dự án từng thử nghiệm chuyển backend sang Supabase Edge Functions (dùng CLI để deploy), nhưng vì toàn bộ quá trình phát triển diễn ra trên điện thoại (không có PC), quy trình đó bất tiện hơn so với Vercel. Vì vậy Vercel được giữ lại làm backend chính, và phần code thử nghiệm trên Supabase Edge Functions đã được gỡ bỏ khỏi repo để tránh gây nhầm lẫn.

---

# Supabase

Supabase là nền tảng trung tâm cho dữ liệu của ứng dụng.

Bao gồm:

- PostgreSQL Database
- Storage

Backend AI (Gemini) không nằm trên Supabase mà nằm trên Vercel — xem phần "Vercel" ở trên.

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

Vercel Serverless Function

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
3. GitHub Pages tự động cập nhật Frontend.
4. Vercel tự động deploy lại nếu thư mục `api/` thay đổi.

---

# Triển khai bằng điện thoại

Một mục tiêu quan trọng của dự án là hạn chế phụ thuộc vào máy tính.

Trong quá trình phát triển:

- Quản lý GitHub trên điện thoại.
- Chỉnh sửa mã nguồn trên điện thoại hoặc máy tính bảng.
- Quản lý Supabase (Database, Storage) trên trình duyệt.
- Quản lý Vercel (biến môi trường, deploy log) trên trình duyệt — không cần CLI hay PC.

Điều này giúp việc phát triển linh hoạt hơn.

---

# Kinh nghiệm

Những kinh nghiệm rút ra:

- Frontend và Backend nên tách riêng.
- API Key không nên xuất hiện trong Frontend.
- GitHub Pages rất phù hợp cho web tĩnh.
- Chọn nền tảng backend dựa trên quy trình phát triển thực tế (ở đây là không có PC), không chỉ dựa trên "kiến trúc lý tưởng".
- Kiến trúc càng đơn giản thì càng dễ bảo trì.
- Khi thử nghiệm một nền tảng mới rồi quyết định không dùng, nên xóa code thử nghiệm khỏi repo ngay, tránh để lại 2 phiên bản backend không đồng bộ.

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