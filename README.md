# 🏠 Home AI - Storage & Forget

> **Ứng dụng quản lý đồ đạc gia đình thông minh hỗ trợ AI Vision đa chế độ, quét mã QR/Barcode và tối ưu dọn dẹp bộ nhớ.**

Home AI (Storage & Forget) là ứng dụng web giúp bạn theo dõi vị trí cất giữ đồ đạc trong gia đình một cách nhanh chóng, trực quan. Nhờ sự hỗ trợ của Google Gemini Vision, ứng dụng có thể tự động phân tích tên đồ đạc, gợi ý vị trí, thẻ đánh dấu (tags) và sắp xếp vào phòng thích hợp.

---

## ✨ Tính năng nổi bật

### 🤖 AI Vision & Nhận diện thông minh
- **Chụp 1 món (Single Scan)**: Nhận diện chi tiết món đồ, tự chọn phòng, gợi ý vị trí và tags.
- **📸 Multi-Scan (Nhận diện đa vật thể)**: Tự động phát hiện và tách tối đa 10 món đồ riêng biệt từ một bức ảnh chụp chung (mặt bàn, hộc tủ). Dùng chung 1 file ảnh gốc để tối ưu dung lượng Storage.
- **⚡ Burst Mode (Chụp liên tục song song)**: Chụp hàng loạt nhiều ảnh, xử lý ngầm song song theo cụm 3 ảnh (`BURST_CONCURRENCY = 3`) với thanh tiến trình trực quan.
- **Duyệt Batch Modal**: Cho phép kiểm tra, đổi tên, chỉnh sửa tag/mô tả và chọn/bỏ chọn danh sách món đồ trước khi lưu hàng loạt vào vị trí mặc định.

### 📷 Quản lý ảnh & Trải nghiệm UX
- **Compressor.js**: Tự động xoay chuẩn EXIF và nén ảnh định dạng `.webp` trước khi tải lên, tiết kiệm 80-90% dung lượng.
- **Viewer.js**: Trình phóng to, xoay và xem chi tiết danh sách ảnh toàn màn hình mượt mà.
- **SortableJS**: Kéo thả sắp xếp thứ tự danh sách ảnh phụ trực quan.
- **Thêm nhiều ảnh phụ**: Cho phép chụp/thêm nhiều ảnh góc quay khác nhau cho cùng một món đồ.

### 🔍 Tìm kiếm & Quản lý vị trí
- **📷 Quét mã QR / Barcode**: Tích hợp camera quét mã vạch hoặc mã QR để tìm kiếm nhanh sản phẩm.
- **Tìm kiếm & Lọc tức thì**: Tìm kiếm theo tên, tag, vị trí và lọc danh sách theo từng phòng hoặc Thùng rác.
- **Quản lý phòng & Thống kê**: Thêm, sửa tên, xóa phòng và xem số lượng món đồ đang cất giữ theo từng khu vực.

### 🗑️ Thùng rác & Dọn dẹp tự động
- **Soft Delete**: Chuyển món đồ vào Thùng rác và lưu vết phòng cũ (`previous_room`) để dễ dàng khôi phục.
- **Dọn dẹp file mồ côi (`cleanOrphanedStorageFiles`)**: Tự động quét dọn toàn bộ tệp ảnh dư thừa trên Supabase Storage không còn liên kết với dữ liệu.
- **Xóa tự động 30 ngày**: Tự động dọn dẹp các mục nằm trong Thùng rác quá 30 ngày.

---

## 🏗️ Kiến trúc ứng dụng

Frontend (GitHub Pages - HTML5/CSS3/Vanilla JS)
│
├─► Supabase Client ──────► PostgreSQL Database + Storage
│
└─► Secret Header Proxy ──► Vercel Serverless Function (api/gemini.js)
│
▼
Google Gemini API

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Thư viện UI/UX**:
  - `Toastify.js` & `SweetAlert2`: Hộp thoại và thông báo toast hiện đại.
  - `DOMPurify`: Bảo mật chống Stored XSS tuyệt đối.
  - `Compressor.js`: Nén ảnh WebP phía Client.
  - `Viewer.js`: Trình xem gallery ảnh.
  - `SortableJS`: Kéo thả re-order ảnh.
  - `html5-qrcode`: Quét mã QR/Barcode qua Camera.
- **Backend AI Proxy**: Vercel Serverless Function (Node.js).
- **AI Model**: Google Gemini (`gemini-flash-latest`).
- **Database & Storage**: Supabase (PostgreSQL & Storage Buckets).

---

## 🚀 Hướng dẫn cài đặt & Triển khai

### 1. Cấu hình Frontend
Sửa file `js/config.js` với thông tin Supabase và secret header proxy của bạn:
```javascript
const SUPABASE_URL = "[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)";
const SUPABASE_KEY = "your-supabase-publishable-key";
const GEMINI_API_URL = "[https://your-vercel-domain.vercel.app/api/gemini](https://your-vercel-domain.vercel.app/api/gemini)";
const APP_SECRET = "your-app-secret-key"; // Phải trùng với biến môi trường Vercel

2. Cấu hình Vercel Serverless Function
​Đặt các biến môi trường trên Vercel Dashboard:
​GEMINI_API_KEY: API Key lấy từ Google AI Studio.
​APP_SECRET: Mã bí mật chống spam endpoint (Khớp với APP_SECRET ở client).
​🔒 Bảo mật
​Chống Stored XSS: Mọi dữ liệu do người dùng hoặc AI tạo ra trước khi chèn vào DOM đều qua hàm escapeHtml() tích hợp DOMPurify.
​Bảo vệ API Key: GEMINI_API_KEY nằm hoàn toàn ở môi trường server-side trên Vercel, không lộ ra Client.
​Xác thực Endpoint AI: Serverless Proxy yêu cầu header x-app-secret để ngăn chặn bot/scanner lợi dụng spam tốn chi phí.