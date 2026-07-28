# Roadmap

Tài liệu này mô tả định hướng phát triển của Storage & Forget.

Roadmap chỉ ghi các mục tiêu lớn, không thay thế Changelog.

---

# Hoàn thành

## Core

- [x] Lưu đồ vật
- [x] Chỉnh sửa
- [x] Xóa
- [x] Upload ảnh
- [x] Resize ảnh
- [x] Preview ảnh

## Database

- [x] Supabase Database
- [x] Supabase Storage
- [x] CRUD hoàn chỉnh

## Search

- [x] Tìm kiếm
- [x] Lọc dữ liệu

## Rooms

- [x] Quản lý phòng
- [x] Thống kê

## AI

- [x] AI Vision
- [x] AI Suggest
- [x] AI Chat

## Architecture

- [x] Chia module
- [x] Edge Functions
- [x] Prompt riêng
- [x] Response Parser

---

# Ngắn hạn

## AI

- [ ] Cải thiện Prompt.
- [ ] Tăng độ chính xác Vision.
- [ ] Giảm thời gian phản hồi.

## UI

- [ ] Hoàn thiện giao diện.
- [ ] Cải thiện trải nghiệm trên điện thoại.
- [ ] Đồng bộ phong cách hiển thị.

## Code

- [ ] Tiếp tục refactor.
- [ ] Giảm biến global.
- [ ] Chuẩn hóa tên hàm.

---

# Trung hạn

- [ ] Nhiều ảnh cho một đồ vật.
- [ ] Quản lý theo danh mục.
- [ ] Ghi chú.
- [ ] Lịch sử chỉnh sửa.
- [ ] Sao lưu và khôi phục dữ liệu.
- [ ] Xuất/Nhập dữ liệu.

---

# Dài hạn

## AI

- [ ] Semantic Search.
- [ ] OCR.
- [ ] Nhận diện nhiều đồ vật trong một ảnh.
- [ ] Hội thoại có ngữ cảnh.
- [ ] Đề xuất vị trí lưu trữ tối ưu.

## Ứng dụng

- [ ] Progressive Web App hoàn chỉnh.
- [ ] Đồng bộ nhiều thiết bị.
- [ ] Hỗ trợ nhiều người dùng.
- [ ] Chia sẻ dữ liệu trong gia đình.

---

# Mục tiêu kiến trúc

Trong các phiên bản tiếp theo, dự án sẽ tiếp tục hướng tới:

- Module nhỏ và độc lập.
- Dễ bảo trì.
- Dễ kiểm thử.
- Dễ mở rộng.
- Hạn chế phụ thuộc giữa các module.

---

# Mục tiêu cuối cùng

Storage & Forget không chỉ là một ứng dụng lưu đồ vật.

Mục tiêu lâu dài là xây dựng một nền tảng quản lý đồ dùng gia đình có tích hợp AI, dễ sử dụng, dễ triển khai và có thể tái sử dụng kiến trúc cho các dự án web AI khác.