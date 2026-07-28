# AI

Storage & Forget sử dụng Google Gemini để hỗ trợ người dùng nhập liệu và tìm kiếm thông minh.

AI được thiết kế là một thành phần hỗ trợ, không thay thế người dùng trong việc quyết định dữ liệu cuối cùng.

---

# Kiến trúc

```
Browser
      │
      ▼
Vercel Serverless Function
      │
      ▼
Gemini API
      │
      ▼
JSON
      │
      ▼
Frontend
```

Frontend không giao tiếp trực tiếp với Gemini.

---

# Mục tiêu

AI được sử dụng để:

- Nhận diện đồ vật.
- Gợi ý tên.
- Gợi ý vị trí lưu.
- Hỗ trợ nhập liệu.
- Trả lời câu hỏi về dữ liệu.

---

# Vision

Luồng hoạt động:

```
Chọn ảnh

↓

Resize

↓

Base64

↓

Vercel Serverless Function

↓

Gemini Vision

↓

JSON

↓

Điền Form
```

Vision giúp giảm thời gian nhập liệu.

Người dùng vẫn có thể chỉnh sửa trước khi lưu.

---

# Chat

AI Chat được xây dựng để trả lời các câu hỏi liên quan đến dữ liệu trong ứng dụng.

Ví dụ:

- Đồ vật này là gì?
- Nên cất ở đâu?
- Công dụng của vật này?

Chat không truy cập trực tiếp Database.

---

# Suggest

AI Suggest hỗ trợ:

- Gợi ý tên đồ vật.
- Gợi ý phòng.
- Gợi ý vị trí.
- Chuẩn hóa dữ liệu nhập.

---

# Prompt

Prompt được tách riêng khỏi giao diện.

Điều này giúp:

- Dễ chỉnh sửa.
- Dễ thử nghiệm.
- Không ảnh hưởng Frontend.
- Có thể tái sử dụng.

---

# Response

Kết quả từ Gemini được chuẩn hóa trước khi trả về Frontend.

Ưu điểm:

- Dễ xử lý.
- Dễ kiểm tra lỗi.
- Hạn chế AI trả về định dạng không mong muốn.

---

# Vercel Serverless Function

Vercel Serverless Function (`api/gemini.js`) là lớp trung gian giữa ứng dụng và Gemini.

Vai trò:

- Bảo vệ API Key.
- Gọi Gemini API.
- Xử lý Prompt.
- Chuẩn hóa phản hồi.
- Dễ thay đổi model.

Đây là một quyết định kiến trúc quan trọng của dự án.

Lưu ý: dự án từng thử nghiệm chuyển sang Supabase Edge Functions, nhưng vì phát triển hoàn toàn trên điện thoại (không có PC), quy trình deploy của Vercel thuận tiện hơn nên Vercel được giữ làm backend chính. Xem `DEPLOYMENT.md` và `LESSONS_LEARNED.md`.

---

# Image Optimization

Trước khi gửi AI:

- Resize ảnh.
- Giảm dung lượng.
- Chuyển sang định dạng phù hợp.

Lợi ích:

- Phản hồi nhanh hơn.
- Tiết kiệm băng thông.
- Giảm chi phí xử lý.
- Giảm token.

---

# Kinh nghiệm

Trong quá trình phát triển đã rút ra một số kinh nghiệm:

- Không gọi AI trực tiếp từ Frontend.
- Prompt nên được chuẩn hóa.
- Luôn kiểm tra dữ liệu AI trả về.
- Không phụ thuộc vào một model cố định.
- Thiết kế để dễ thay đổi model khi cần.

---

# Có thể cải thiện

Trong tương lai có thể bổ sung:

- Streaming Response.
- Function Calling.
- Embedding.
- Semantic Search.
- OCR.
- Nhận diện nhiều đồ vật trong một ảnh.
- Hội thoại có ngữ cảnh.

---

# Tổng kết

AI là một thành phần hỗ trợ giúp giảm thao tác nhập liệu và nâng cao trải nghiệm người dùng.

Thiết kế hiện tại đảm bảo:

- Bảo mật.
- Dễ mở rộng.
- Dễ thay đổi model.
- Dễ bảo trì.
- Có thể tái sử dụng cho các dự án AI khác.