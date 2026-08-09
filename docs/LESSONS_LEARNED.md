# Lessons Learned

Tổng hợp những bài học kinh nghiệm xương máu rút ra từ quá trình phát triển và refactor dự án Storage & Forget.

---

# 1. Bảo vệ API Endpoint & Tài nguyên AI

- **Bài học**: Khi mở rộng các tính năng AI xử lý số lượng lớn (như Multi-Scan hay Burst Mode), bề mặt tấn công sẽ tăng lên đáng kể. Nếu endpoint Serverless Function không có xác thực, kẻ xấu có thể gửi request lặp lại làm cạn kiệt API credit rất nhanh.
- **Giải pháp**: Thiết lập header bí mật `x-app-secret` truyền giữa Client và Server Proxy. Nếu header này không hợp lệ, Proxy lập tức từ chối request với mã lỗi `401 Unauthorized`.

---

# 2. Tối ưu hóa Lưu trữ Storage (Shared Resources)

- **Bài học**: Ở tính năng Multi-Scan, khi AI tách 1 bức ảnh ra thành N món đồ, nếu không chú ý sẽ dễ dẫn đến việc upload lại chính bức ảnh gốc đó N lần riêng biệt lên Storage, gây lãng phí dung lượng và thời gian upload.
- **Giải pháp**: Tải bức ảnh gốc lên duy nhất 1 lần trước vòng lặp, lấy URL công khai (`sharedImageUrl`) và gán lại cho tất cả các bản ghi món đồ được chọn.

---

# 3. Vá lỗ hổng Stored XSS bằng Sanitization Chuẩn

- **Bài học**: Sử dụng Template Literals và `innerHTML` trong Vanilla JS rất tiện lợi để render giao diện, nhưng nếu dữ liệu người dùng (tên đồ, mô tả, vị trí) hoặc dữ liệu AI trả về không qua hàm escape sẽ dẫn đến rủi ro Stored XSS nghiêm trọng.
- **Giải pháp**: Tạo hàm `escapeHtml()` dùng thư viện `DOMPurify` và ép buộc áp dụng lên 100% các giá trị động trước khi đưa vào DOM.

---

# 4. Tránh Lỗi N+1 Query trong Database Thao Tác Mảng

- **Bài học**: Việc thực hiện vòng lặp `for...of` gọi query Supabase riêng lẻ cho từng ID bản ghi sẽ làm tăng số lượng request không cần thiết.
- **Giải pháp**: Gom tất cả danh sách ID và thực hiện query 1 lần bằng cú pháp `.in("id", ids)`.

---

# 5. Tái sử dụng Code (DRY) cho các Module AI

- **Bài học**: Việc từng file AI (`vision.js`, `multi-scan.js`, `burst-capture.js`) tự viết lại đoạn mã `fetch()` API sẽ gây lặp mã và khó bảo trì khi cần thay đổi timeout hay đính kèm header mới.
- **Giải pháp**: Tạo module trung tâm `js/ai/gemini-client.js` chứa hàm `callGeminiAPI()` dùng chung cho toàn hệ thống.
