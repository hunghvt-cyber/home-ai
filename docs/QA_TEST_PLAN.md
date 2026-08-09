# 🧪 QA Test Plan & Test Cases

Tài liệu định nghĩa Kế hoạch kiểm thử chất lượng phần mềm (QA) và danh sách kịch bản kiểm thử (Test Cases) cho ứng dụng **Home AI (Storage & Forget)**.

---

## 🎯 1. Phạm vi kiểm thử (Scope)

- **Chức năng chính**: Thêm/Sửa/Xóa đồ đạc, Quản lý phòng, Thống kê, Soft Delete & Khôi phục Thùng rác.
- **Tính năng AI**: Single Scan, Multi-Scan, Burst Capture, Batch Modal Review.
- **Tính năng mở rộng**: Quét QR/Barcode, Nén ảnh WebP, Trình xem Viewer.js, Re-order ảnh phụ.
- **Bảo mật & Hiệu năng**: Chống Stored XSS, Bảo mật Secret Proxy, Quét file mồ côi Storage.

---

## 📋 2. Kịch bản kiểm thử chi tiết (Test Cases)

### 2.1. Bảo mật & An toàn dữ liệu

| ID | Kịch bản kiểm thử | Các bước thực hiện | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|---|
| **SEC-01** | Kiểm tra chống Stored XSS | Nhập tên món đồ: `<script>alert('XSS')</script>` hoặc `<img src=x onerror=alert(1)>` rồi nhấn Lưu. | Chuỗi được escape an toàn qua DOMPurify. Không có script nào bị thực thi khi render thẻ Card. | **PASS** ✅ |
| **SEC-02** | Kiểm tra Secret Header Proxy | Gửi request `POST` trực tiếp đến `api/gemini` mà không kèm header `x-app-secret`. | Server Vercel trả về mã lỗi `401 Unauthorized`. | **PASS** ✅ |
| **SEC-03** | Kiểm tra khóa API Gemini | Mở F12 DevTools Network tab và thực hiện phân tích AI. | Không tìm thấy giá trị `GEMINI_API_KEY` trong các request từ phía Client. | **PASS** ✅ |

---

### 2.2. Tính năng AI (Single / Multi-Scan / Burst Mode)

| ID | Kịch bản kiểm thử | Các bước thực hiện | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|---|
| **AI-01** | Single Scan thành công | Chọn 1 ảnh đồ vật -> Nhấn "🤖 AI Phân tích". | Form được tự động điền Tên, Vị trí, Tags, Mô tả và Phòng phù hợp. | **PASS** ✅ |
| **AI-02** | Multi-Scan tối ưu Storage | Chọn 1 ảnh chụp nhiều món -> Bấm Multi-Scan -> Bấm "Lưu toàn bộ". | Tách thành công danh sách món. Chỉ có **1 file ảnh** được upload lên Supabase Storage và dùng chung link `image_url`. | **PASS** ✅ |
| **AI-03** | Burst Mode song song & Timeout | Chọn cùng lúc 5 ảnh trong Burst Mode. | Hiển thị thanh tiến trình %, gửi xử lý song song từng nhóm 3 ảnh. Nếu timeout 60s, hệ thống báo lỗi không làm treo UI. | **PASS** ✅ |

---

### 2.3. Quản lý Thùng rác & Dọn dẹp Storage

| ID | Kịch bản kiểm thử | Các bước thực hiện | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|---|
| **TR-01** | Xóa mềm & Khôi phục | Nhấn biểu tượng 🗑️ tại card món đồ. Bật filter "Thùng rác" -> Bấm ♻️ Khôi phục. | Món đồ chuyển sang Thùng rác. Khi khôi phục, món đồ quay trở về đúng `previous_room` ban đầu. | **PASS** ✅ |
| **TR-02** | Dọn dẹp tệp rác Storage | Nhấn "Làm sạch thùng rác". | Hệ thống xóa vĩnh viễn các mục trong thùng rác, đồng thời quét và gỡ bỏ toàn bộ file ảnh mồ côi trên Bucket Storage. | **PASS** ✅ |

---

### 2.4. Tiện ích UI/UX (QR, Compressor, Viewer)

| ID | Kịch bản kiểm thử | Các bước thực hiện | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|---|
| **UX-01** | Quét mã QR/Barcode | Bấm "📷 Quét QR" -> Đưa mã vạch vào khung quét. | Camera hoạt động, nhận diện mã vạch và tự động điền kết quả vào ô Tìm kiếm để lọc danh sách. | **PASS** ✅ |
| **UX-02** | Xem ảnh Viewer.js | Bấm trực tiếp vào ảnh của bất kỳ món đồ nào trong danh sách. | Mở modal Viewer.js cho phép phóng to, thu nhỏ, xoay ảnh mượt mà. | **PASS** ✅ |
| **UX-03** | Tự động nén ảnh | Chọn 1 bức ảnh gốc dung lượng lớn (ví dụ: 5MB-10MB). | `Compressor.js` tự động nén về dạng WebP nhẹ (<300KB) và xoay đúng góc trước khi tải lên. | **PASS** ✅ |
