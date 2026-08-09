# Deployment Guide

Storage & Forget được thiết kế để triển khai hoàn toàn miễn phí, dễ quản lý và cập nhật nhanh chóng ngay cả trên thiết bị di động.

---

# Kiến trúc triển khai
GitHub Repository (hunghvt-cyber-home-ai)
│
├──────────────────────────────┐
▼                              ▼
GitHub Pages                    Vercel Platform
(Web tĩnh Frontend)             (Serverless Proxy api/gemini.js)
│                              │
├─► Supabase (PostgreSQL/Storage)
└─► Vercel Proxy ────────────► Google Gemini API

---

# 1. Triển khai Frontend (GitHub Pages)

1. Đẩy toàn bộ mã nguồn lên nhánh chính (`main` hoặc `master`) trên GitHub.
2. Tại GitHub Repository, truy cập **Settings** -> **Pages**.
3. Ở mục **Source**, chọn **Deploy from a branch** và chọn nhánh `main` / thư mục `root`.
4. Bấm **Save**. Trang web sẽ được cập nhật tại địa chỉ: `https://<username>.github.io/<repo-name>/`.

---

# 2. Triển khai Backend AI Proxy (Vercel)

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com) và chọn **Add New** -> **Project**.
2. Kết nối với GitHub Repository `hunghvt-cyber-home-ai`.
3. Vercel sẽ tự động nhận diện thư mục `api/` dưới dạng các Node.js Serverless Functions.
4. Vào mục **Environment Variables** trên Vercel và thiết lập 2 biến môi trường bắt buộc:
   - `GEMINI_API_KEY`: API Key lấy từ Google AI Studio.
   - `APP_SECRET`: Mã bí mật tùy chọn do bạn đặt để chống spam endpoint.
5. Nhấn **Deploy**.

---

# 3. Cấu hình file `js/config.js` ở Frontend

Mở file `js/config.js` trên repo và cập nhật chính xác các giá trị tương ứng:

```javascript
const SUPABASE_URL = "[https://dypqawaqlrthhfxnmxom.supabase.co](https://dypqawaqlrthhfxnmxom.supabase.co)";
const SUPABASE_KEY = "sb_publishable_tZwvgJDIo89qG7sqp5oIJg_GoFa8qMG";

// URL trang Vercel sau khi deploy thành công
const GEMINI_API_URL = "[https://your-vercel-app.vercel.app/api/gemini](https://your-vercel-app.vercel.app/api/gemini)";

// Giá trị APP_SECRET PHẢI KHỚP KHÔNG SAI MỘT KÝ TỰ với APP_SECRET trên Vercel
const APP_SECRET = "Joker@x93";