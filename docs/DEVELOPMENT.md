# Development History

Tài liệu này ghi lại toàn bộ quá trình phát triển của Storage & Forget.

Mục tiêu không phải chỉ để nhớ "đã làm gì", mà còn ghi lại "vì sao lại làm như vậy", giúp áp dụng kinh nghiệm cho các dự án sau.

---

# Ý tưởng ban đầu

Storage & Forget được tạo ra để giải quyết một vấn đề rất đơn giản:

> "Mình cất đồ ở đâu rồi?"

Thay vì phải nhớ hoặc tìm kiếm thủ công, người dùng chỉ cần chụp ảnh, nhập vị trí và để AI hỗ trợ nhận diện.

---

# Quá trình phát triển

## Giai đoạn khởi đầu

- Xây dựng giao diện cơ bản.
- Lưu dữ liệu thủ công.
- Chưa có AI.

---

## Chuyển sang Supabase

Lý do:

- Database mạnh hơn.
- Có Storage.
- Có Authentication nếu cần.
- Dễ mở rộng.

---

## Bổ sung AI

- Google Gemini Vision.
- Google Gemini Chat.
- Prompt tối ưu cho nhận diện đồ vật.

---

## Tối ưu hiệu năng

- Resize ảnh trước khi gửi AI.
- Giảm dung lượng upload.
- Tách module.
- Tối ưu trải nghiệm trên điện thoại.

---

## Hoàn thiện

- Search.
- Edit.
- Delete.
- Toast Message.
- Quản lý phòng.
- Cải thiện UI.

---

# Những quyết định đúng

> Nội dung sẽ được cập nhật trong quá trình phát triển.

---

# Những sai lầm

> Nội dung sẽ được cập nhật trong quá trình phát triển.

---

# Những bài học

Chi tiết xem:

LESSONS_LEARNED.md

---

# Ghi chú

Development History sẽ luôn được cập nhật sau mỗi phiên bản lớn.