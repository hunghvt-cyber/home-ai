# Lessons Learned

Đây là tài liệu ghi lại những bài học và kinh nghiệm rút ra trong quá trình phát triển Storage & Forget.

Mục tiêu là áp dụng những kinh nghiệm này cho mọi dự án sau, tránh lặp lại các sai lầm cũ.

---

# Nguyên tắc

- Ưu tiên code dễ đọc hơn code quá thông minh.
- Mỗi file chỉ nên đảm nhiệm một nhiệm vụ.
- Tách UI và Business Logic.
- Không tối ưu quá sớm.
- Luôn nghĩ đến khả năng mở rộng.

---

# Những điều nên làm

- Chia module theo chức năng.
- Đặt tên hàm rõ nghĩa.
- Tái sử dụng code khi có thể.
- Thêm xử lý lỗi cho mọi API.
- Luôn có trạng thái Loading.
- Thông báo lỗi rõ ràng cho người dùng.
- Resize ảnh trước khi upload hoặc gửi AI.
- Ghi tài liệu ngay khi hoàn thành một tính năng lớn.

---

# Những điều nên tránh

- File JavaScript quá lớn.
- Hardcode giá trị trong nhiều nơi.
- Hàm làm quá nhiều việc.
- Code trùng lặp.
- Bỏ qua việc xử lý lỗi.
- Để tài liệu bị lỗi thời.

---

# Checklist cho dự án mới

- Thiết kế cấu trúc thư mục.
- Thiết kế Database.
- Thiết kế API.
- Thiết kế UI.
- Viết README.
- Tạo thư mục docs.
- Chuẩn bị CHANGELOG.
- Chuẩn bị ROADMAP.

---

# Sẽ cập nhật

Tài liệu này sẽ được bổ sung sau mỗi phiên bản khi có thêm kinh nghiệm mới.