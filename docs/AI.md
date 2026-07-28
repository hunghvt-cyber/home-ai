# AI

Tài liệu này mô tả toàn bộ hệ thống AI của Storage & Forget.

---

# Mục tiêu

AI được sử dụng để giúp người dùng:

- Nhận diện đồ vật từ hình ảnh.
- Gợi ý tên đồ vật.
- Hỗ trợ tìm kiếm.
- Trả lời các câu hỏi liên quan đến dữ liệu.

---

# AI Provider

Google Gemini.

Các model sẽ được cập nhật theo từng thời điểm phát triển của dự án.

---

# AI Features

## Vision

- Phân tích hình ảnh.
- Nhận diện đồ vật.
- Gợi ý tên.
- Gợi ý vị trí lưu trữ.

---

## Chat

- Trả lời câu hỏi.
- Hỗ trợ người dùng.
- Gợi ý thao tác.

---

# Prompt Engineering

Prompt được tối ưu để:

- Kết quả ổn định.
- Dễ parse.
- Hạn chế AI trả lời lan man.
- Giảm token không cần thiết.

---

# Image Processing

Trước khi gửi AI:

- Resize ảnh.
- Giảm dung lượng.
- Chuyển sang định dạng phù hợp.
- Tối ưu tốc độ phản hồi.

---

# Edge Functions

Frontend không gọi trực tiếp Gemini API.

Mọi yêu cầu AI đều đi qua Supabase Edge Functions để:

- Ẩn API Key.
- Tăng bảo mật.
- Dễ thay đổi model.
- Quản lý request tập trung.

---

# Kinh nghiệm

Tài liệu này sẽ ghi lại:

- Những model đã sử dụng.
- Những model đã ngừng hỗ trợ.
- Những lỗi từng gặp.
- Các cách tối ưu tốc độ.
- Kinh nghiệm viết Prompt.

---

# Ghi chú

Hệ thống AI sẽ tiếp tục được cải thiện trong các phiên bản tiếp theo.