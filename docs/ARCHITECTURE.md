# Architecture

Storage & Forget được thiết kế theo hướng **Module-based Architecture** sử dụng HTML, CSS và Vanilla JavaScript thuần, kết hợp với Backend Proxy nhẹ trên Vercel.

Mục tiêu là giữ mã nguồn đơn giản, dễ đọc, dễ bảo trì và có thể mở rộng mà không phụ thuộc vào các framework phức tạp.

---

# Sơ đồ tổng quan kiến trúc
Browser
│
▼
UI (index.html + css/style.css)
│
▼
Application Controller (app.js)
│
├──────────────┬──────────────┬──────────────┬──────────────┐
▼              ▼              ▼              ▼              ▼
Image       Database       Search         Rooms          AI
(image.js) (database/)   (search/)    (rooms/)     (ai/)
│              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
│
├────────────────────────┐
▼                        ▼
Supabase                 Vercel Proxy
Database + Storage          (api/gemini.js)
│
▼
Google Gemini


---

# Cấu trúc thư mục
hunghvt-cyber-home-ai/
├── README.md
├── index.html
├── api/                   # Backend Vercel Serverless Functions
│   ├── gemini.js          # API Endpoint Proxy
│   ├── prompt.js          # Khai báo Prompt AI
│   └── response.js        # Parser & Cleaner dữ liệu JSON trả về
├── css/
│   └── style.css          # Style toàn bộ giao diện app
├── docs/                  # Tài liệu kỹ thuật dự án
├── js/
│   ├── app.js             # Khởi tạo ứng dụng & bắt lỗi toàn cục
│   ├── config.js          # Cấu hình hằng số Supabase, URL API, APP_SECRET
│   ├── image.js           # Xử lý chọn ảnh, preview, nén Compressor.js
│   ├── ai/                # Các module xử lý AI
│   │   ├── burst-capture.js # Chụp liên tục song song
│   │   ├── chat.js          # Chatbot trợ lý (định hướng)
│   │   ├── gemini-client.js # Service gọi API Gemini dùng chung
│   │   ├── multi-scan.js    # Nhận diện đa vật thể trong 1 ảnh
│   │   ├── suggest.js      # Gợi ý thông minh (định hướng)
│   │   └── vision.js       # Phân tích 1 ảnh đơn
│   ├── database/          # Trung tâm thao tác dữ liệu Supabase
│   │   ├── delete.js       # Xóa mềm (chuyển vào Thùng rác)
│   │   ├── edit.js         # Đưa dữ liệu lên form chỉnh sửa
│   │   ├── form.js         # Reset và quản lý trạng thái form
│   │   ├── image-gallery.js# Quản lý ảnh phụ (Viewer.js, SortableJS)
│   │   ├── load.js         # Load dữ liệu items & map ảnh phụ
│   │   ├── message.js      # Toastify & SweetAlert2 thông báo
│   │   ├── render.js       # Render thẻ Card danh sách món đồ
│   │   ├── save-extra.js   # Upload & dọn dẹp ảnh phụ
│   │   ├── save-item.js    # Insert/Update món đồ trong DB
│   │   ├── save-upload.js  # Upload ảnh chính lên Storage WebP
│   │   ├── save-utils.js   # Hàm escapeHtml (DOMPurify), dọn Storage
│   │   ├── save.js         # Luồng lưu chính (Save / Skip)
│   │   └── trash.js        # Khôi phục, dọn file rác, xóa 30 ngày
│   ├── rooms/             # Quản lý phòng & Thống kê
│   │   ├── rooms.js        # CRUD danh sách phòng
│   │   └── stats.js        # Thống kê số lượng món theo phòng
│   └── search/            # Tìm kiếm & Lọc
│       ├── filter.js       # Lọc theo từ khóa & phòng trên RAM
│       └── search.js       # Debounce input & Quét camera QR/Barcode


---

# Các nguyên tắc thiết kế quan trọng

1. **Single Responsibility**: Mỗi file JS chỉ đảm nhiệm một nhóm tác vụ duy nhất (ví dụ: `save-upload.js` chỉ xử lý tải ảnh lên Storage, `message.js` chỉ hiển thị thông báo).
2. **In-Memory Filtering**: Dữ liệu sau khi tải từ Supabase được lưu vào mảng `allItems[]`. Việc tìm kiếm, lọc phòng, thống kê đều tính toán trực tiếp trên RAM phía Browser, giảm tối đa số request truy vấn DB.
3. **Data Sanitization**: Toàn bộ dữ liệu hiển thị ra HTML đều đi qua hàm `escapeHtml()` tích hợp thư viện `DOMPurify` để ngăn chặn lỗ hổng Stored XSS.
4. **Proxy Protection**: Endpoint AI trên Vercel yêu cầu secret header `x-app-secret` khớp với biến môi trường `APP_SECRET` để chống bot/scanner tự động lạm dụng API credit.
5. **Shared Resource Optimization**: Chế độ Multi-Scan chỉ upload đúng 1 ảnh gốc và gán link `image_url` chung cho toàn bộ danh sách các món đồ tách ra từ bức ảnh đó.