# Lessons Learned

Tài liệu này ghi lại những bài học quan trọng rút ra trong quá trình phát triển Storage & Forget.

Đây là những kinh nghiệm thực tế để áp dụng cho các dự án sau.

---

# 1. Chia module càng sớm càng tốt

Ban đầu việc gom nhiều chức năng vào một file giúp phát triển nhanh.

Tuy nhiên khi dự án lớn hơn:

- Khó đọc.
- Khó sửa.
- Khó mở rộng.

Sau khi tách thành các module:

- Database
- AI
- Search
- Rooms
- Image

việc phát triển trở nên dễ dàng hơn rất nhiều.

---

# 2. Một file chỉ nên có một trách nhiệm

Ví dụ:

- save.js chỉ lưu dữ liệu.
- load.js chỉ đọc dữ liệu.
- render.js chỉ hiển thị.
- image.js chỉ xử lý ảnh.
- message.js chỉ hiển thị thông báo.

Đây là nguyên tắc giúp code dễ bảo trì.

---

# 3. Không để Frontend gọi AI trực tiếp

Ban đầu Frontend gọi Gemini API trực tiếp.

Sau đó chuyển sang Edge Function.

Lợi ích:

- Bảo vệ API Key.
- Dễ thay đổi model.
- Dễ bảo trì.
- Dễ kiểm soát request.

Đây là một trong những quyết định đúng nhất của dự án.

---

# 4. Resize ảnh trước khi xử lý

Resize ảnh trước khi upload hoặc gửi AI giúp:

- Giảm dung lượng.
- Tăng tốc xử lý.
- Giảm băng thông.
- Tiết kiệm token.

Đây là một bước tối ưu quan trọng.

---

# 5. Chỉ lưu URL ảnh

Không lưu Base64 trong Database.

Ưu điểm:

- Database nhỏ.
- Backup nhanh.
- Truy vấn hiệu quả hơn.
- Dễ thay đổi Storage.

---

# 6. Hạn chế query lặp

Dữ liệu được tải một lần và lưu trong bộ nhớ.

Các chức năng như:

- Search
- Filter
- Rooms
- Statistics

đều sử dụng lại dữ liệu đã tải.

Điều này giúp giảm request đến Database.

---

# 7. Refactor định kỳ

Không nên đợi dự án hoàn thành mới refactor.

Việc cải thiện cấu trúc sau mỗi giai đoạn giúp:

- Code sạch hơn.
- Ít lỗi hơn.
- Dễ bổ sung tính năng mới.

---

# 8. Viết tài liệu sớm

Đây là bài học lớn nhất.

Nếu viết tài liệu ngay từ đầu sẽ:

- Dễ nhớ quyết định thiết kế.
- Dễ quay lại dự án sau thời gian dài.
- Dễ tái sử dụng cho dự án khác.

---

# 9. GitHub là một phần của dự án

Không chỉ dùng để lưu mã nguồn.

GitHub còn giúp:

- Theo dõi lịch sử.
- Quản lý phiên bản.
- Đồng bộ giữa các thiết bị.
- Triển khai GitHub Pages.

---

# 10. Thiết kế để có thể thay đổi

Trong quá trình phát triển đã thay đổi:

- Model AI.
- Backend.
- Kiến trúc triển khai.

Việc tách module giúp các thay đổi này không ảnh hưởng toàn bộ dự án.

---

# 11. Xóa code thử nghiệm ngay khi không dùng nữa

Dự án từng thử viết lại backend AI bằng Supabase Edge Functions song song với bản Vercel đang chạy.

Vì không xóa ngay, 2 bản backend dần lệch nhau (khác model, khác tính năng) mà không ai nhận ra cho đến khi đọc lại toàn bộ code.

Bài học:

- Nhánh/bản thử nghiệm không dùng nữa nên xóa khỏi repo chính ngay, hoặc để ở branch riêng.
- Không giữ lại "phòng khi cần" — vì code cũ không ai bảo trì rất dễ gây hiểu nhầm là đang được dùng thật.

---

# Những điều sẽ làm khác nếu bắt đầu lại

- Thiết kế cấu trúc thư mục ngay từ đầu.
- Dùng ES Modules ngay từ phiên bản đầu tiên.
- Chuẩn hóa quy tắc đặt tên.
- Viết tài liệu song song với quá trình phát triển.
- Tách các service dùng chung sớm hơn.

---

# Tổng kết

Storage & Forget không chỉ là một ứng dụng lưu đồ vật.

Đây là một dự án giúp tích lũy kinh nghiệm về:

- Thiết kế kiến trúc.
- Quản lý mã nguồn.
- Tổ chức module.
- AI.
- Supabase.
- Triển khai ứng dụng web.

Những bài học này có thể áp dụng trực tiếp cho các dự án web AI trong tương lai.