
---

### 📄 FILE 2: `docs/AI.md`

```markdown
# AI Architecture & Implementation

Storage & Forget sử dụng Google Gemini làm nhân tố hỗ trợ người dùng nhập liệu và tự động phân loại đồ đạc.

AI được thiết kế đóng vai trò trợ lý nhập liệu, không quyết định hoàn toàn dữ liệu mà luôn cho phép người dùng xem lại và chỉnh sửa trước khi lưu.

---

# Kiến trúc xử lý AI
Browser (Client)
│
├─ (Request + Header: x-app-secret)
▼
Vercel Serverless Function (api/gemini.js)
│
├─ (Prompt + Image Base64)
▼
Gemini API (gemini-flash-latest)
│
├─ (Raw Response)
▼
Response Cleaner (api/response.js)
│
▼
JSON Output ──► Form / Batch Review Modal (Frontend)


Frontend không giao tiếp trực tiếp với Gemini API để bảo mật khóa `GEMINI_API_KEY` và tránh rò rỉ token.

---

# Chế độ AI Vision Supported

### 1. Single Vision (`js/ai/vision.js`)
- Nhận diện 1 đồ vật chính trong ảnh.
- Gợi ý: Tên đồ đạc, Vị trí cất, Tags, Mô tả và Phòng phù hợp trong danh sách phòng hiện có.

### 2. Multi-Scan (`js/ai/multi-scan.js`)
- Nhận diện tối đa 10 đồ vật riêng biệt trong cùng một bức ảnh (ví dụ: chụp toàn bộ bàn làm việc, hộc tủ).
- Trả về danh sách mảng JSON `items: [...]`.
- Hiển thị trên Batch Review Modal cho phép kiểm tra, tick chọn/bỏ chọn món đồ.
- **Tối ưu Storage**: Tải duy nhất 1 tệp ảnh gốc lên Supabase Storage và chia sẻ chung `image_url` cho mọi món đồ được chọn.

### 3. Burst Mode (`js/ai/burst-capture.js`)
- Hỗ trợ chụp/chọn hàng loạt ảnh cùng lúc.
- Sử dụng mô hình xử lý song song theo cụm 3 ảnh (`BURST_CONCURRENCY = 3`) với `Promise.all()` giúp phân tích nhanh mà không làm sập request.
- Tích hợp thanh tiến trình (ProgressBar) hiển thị phần trăm tiến độ xử lý.

---

# Client Service (`js/ai/gemini-client.js`)

Toàn bộ các module AI phía Client (`vision.js`, `multi-scan.js`, `burst-capture.js`) đều tái sử dụng hàm trung gian `callGeminiAPI(payload)` với các đặc tính:
- Đích thân gắn header bảo mật `x-app-secret` lấy từ `APP_SECRET` trong `config.js`.
- Cấu hình `AbortController` ngắt kết nối tự động nếu quá 60 giây (Timeout 60s).

---

# Prompt Engineering (`api/prompt.js`)

Prompt được tách độc lập thành module riêng trên Backend Vercel Serverless Function:
- **`createVisionPrompt(rooms)`**: Ép AI chọn phòng duy nhất có sẵn trong DB, trả về JSON chuẩn gồm `name`, `location`, `room`, `tags`, `description`.
- **`createMultiVisionPrompt()`**: Yêu cầu AI tách biệt danh sách vật thể, trả về đối tượng `{"items": [...]}`.

---

# Tối ưu hóa ảnh trước khi gửi AI

Trước khi chuyển đổi sang Base64 để gửi sang Serverless Proxy:
- Resize ảnh về độ phân giải phù hợp (`maxWidth/maxHeight: 1000px`).
- Nén chất lượng ảnh phía Client bằng `Compressor.js`.
- Giảm dung lượng file giúp gửi AI nhanh hơn, tiết kiệm token và giảm thời gian chờ đợi phản hồi.