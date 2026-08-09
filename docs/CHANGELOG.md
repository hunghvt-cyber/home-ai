# 📜 Changelog

Tài liệu ghi lại toàn bộ các thay đổi và nâng cấp qua từng phiên bản của dự án **Home AI - Storage & Forget**.

---

## [v3.5.0] - Nâng cấp Bảo mật, Multi-Scan, Burst Mode & QR Scanner

### 🤖 AI & Phân tích ảnh
- **Multi-Scan (`multi-scan.js`)**: Cho phép nhận diện nhiều vật thể trong 1 bức ảnh (tối đa 10 món).
- **Tối ưu Storage trong Multi-Scan**: Đã sửa lỗi upload trùng lặp. Giờ đây chỉ upload đúng 1 file ảnh gốc lên Storage và dùng chung link `image_url` cho toàn bộ các món được chọn.
- **Burst Mode (`burst-capture.js`)**: Cho phép chụp/chọn hàng loạt ảnh. Xử lý song song theo cụm 3 ảnh (`BURST_CONCURRENCY = 3`) kết hợp `Promise.all()`.
- **Gemini Client (`gemini-client.js`)**: Chuẩn hóa hàm `callGeminiAPI()` dùng chung cho toàn bộ các module AI, hỗ trợ `AbortController` ngắt timeout sau 60s và đính kèm secret header.

### 🛡️ Bảo mật
- **Tích hợp DOMPurify (`save-utils.js`)**: Tăng cường bảo mật với thư viện DOMPurify trong hàm `escapeHtml()`.
- **Vá lỗ hổng Stored XSS**: Áp dụng bọc `escapeHtml()` đầy đủ ở tất cả các vị trí render dữ liệu (`render.js`, `image-gallery.js`, `edit.js`, `app.js`).
- **Proxy Secret Header (`api/gemini.js`)**: Đã thêm bước kiểm tra header `x-app-secret` so với `process.env.APP_SECRET` để chặn truy cập trái phép và chống spam API credit.

### 🎨 UI / UX & Tiện ích
- **Quét mã QR / Barcode (`search.js`)**: Tích hợp thư viện `html5-qrcode` bật camera quét mã vạch/mã QR để tìm kiếm món đồ ngay lập tức.
- **Toastify & SweetAlert2 (`message.js`)**: Thay thế các hàm `alert()` và `confirm()` mặc định bằng giao diện toast và popup mượt mà.
- **Viewer.js & SortableJS (`image-gallery.js`, `render.js`)**: Hỗ trợ xem ảnh toàn màn hình và kéo thả re-order thứ tự ảnh phụ.
- **Compressor.js (`image.js`)**: Tự động xoay chuẩn EXIF và nén ảnh WebP phía Client.

### 🗑️ Quản lý dữ liệu & Thùng rác
- **Soft Delete (`delete.js`)**: Chuyển món đồ vào Thùng rác và lưu vết `previous_room` để khôi phục chính xác vị trí cũ.
- **Dọn dẹp Storage (`cleanOrphanedStorageFiles`)**: Viết hàm quét dọn tự động toàn bộ các tệp ảnh mồ côi tồn đọng trên Supabase Storage không còn liên kết DB.
- **Tối ưu Query Trùng lặp**: Loại bỏ lỗi N+1 query trong `runTrashAutoClean()` bằng cú pháp gom nhóm `.in("id", ids)`.

---

## [v3.0.0] - Refactor Module & Vercel Serverless Function Proxy

- Chuyển backend AI sang Vercel Serverless Function (`api/gemini.js`).
- Tách Prompt AI sang `api/prompt.js` và Cleaner sang `api/response.js`.
- Chia nhỏ thư mục `js/database/` thành các file nghiệp vụ riêng lẻ (`save-item.js`, `save-upload.js`, `save-extra.js`, `save-utils.js`).

---

## [v2.0.0] - Chuyển đổi Supabase & Chia Module Frontend

- Thay thế Google Sheets/Apps Script bằng Supabase PostgreSQL & Storage Bucket.
- Chia cấu trúc ứng dụng thành các thư mục `js/ai/`, `js/database/`, `js/rooms/`, `js/search/`.
