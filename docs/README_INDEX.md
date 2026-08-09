# Documentation Index

Chào mừng bạn đến với hệ thống tài liệu kỹ thuật của dự án **Home AI (Storage & Forget)**. Thư mục `docs/` chứa toàn bộ thông tin chi tiết về kiến trúc, cơ sở dữ liệu, quy trình triển khai và kiểm thử chất lượng.

---

# 📚 Danh mục tài liệu

### 1. 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
Chi tiết kiến trúc hệ thống, cấu trúc thư mục module-based, sơ đồ luồng dữ liệu giữa Frontend, Vercel Serverless Function và Supabase.

### 2. 🤖 [AI.md](./AI.md)
Tài liệu tích hợp AI Vision: Phân tích chi tiết 3 chế độ Single Scan, Multi-Scan, Burst Mode, prompt engineering và dịch vụ `gemini-client.js`.

### 3. 🗄️ [DATABASE.md](./DATABASE.md)
Cơ sở dữ liệu Supabase PostgreSQL: Cấu trúc các bảng `items`, `rooms`, `item_images`, quy trình upload ảnh WebP và dọn dẹp file Storage mồ côi.

### 4. 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md)
Hướng dẫn triển khai từng bước: Triển khai web tĩnh trên GitHub Pages, triển khai Proxy backend trên Vercel và cấu hình biến môi trường.

### 5. 📝 [DEVELOPMENT.md](./DEVELOPMENT.md)
Lịch sử phát triển và các giai đoạn tiến hóa của dự án từ phiên bản Google Sheets ban đầu cho đến kiến trúc hiện tại.

### 6. 📖 [LESSONS_LEARNED.md](./LESSONS_LEARNED.md)
Những bài học kinh nghiệm thực tế về bảo mật Stored XSS, tối ưu hóa Storage, xử lý query Database và bảo vệ API credit.

### 7. 🧪 [QA_TEST_PLAN.md](./QA_TEST_PLAN.md)
Kế hoạch và ma trận kịch bản kiểm thử (Test Cases) đảm bảo chất lượng phần mềm về bảo mật, tính năng AI và UI/UX.

### 8. 📜 [CHANGELOG.md](./CHANGELOG.md)
Lịch sử cập nhật mã nguồn chi tiết qua từng phiên bản phát hành.
