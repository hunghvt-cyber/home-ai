# Development History

Tài liệu này ghi lại quá trình phát triển của Storage & Forget từ những phiên bản đầu tiên.

Mục tiêu không phải để ghi changelog, mà để lưu lại những quyết định thiết kế, bài học và kinh nghiệm cho các dự án sau.

---

# Ý tưởng ban đầu

Storage & Forget được tạo ra để giải quyết một nhu cầu rất thực tế:

> Chụp ảnh đồ vật trong nhà, lưu vị trí và có thể tìm lại nhanh khi cần.

Mục tiêu ban đầu:

- Đơn giản.
- Chạy trên điện thoại.
- Không cần cài đặt.
- Dễ sử dụng cho mọi thành viên trong gia đình.

---

# Giai đoạn 1

Phiên bản đầu tiên chỉ có các chức năng cơ bản:

- Chụp ảnh.
- Nhập tên.
- Nhập vị trí.
- Lưu dữ liệu.

Kiến trúc còn đơn giản và nhiều logic tập trung trong ít file.

---

# Giai đoạn 2

Bắt đầu chia project thành nhiều module.

Các chức năng được tách riêng:

- Database
- Search
- Rooms
- Image
- AI

Đây là bước thay đổi quan trọng nhất của dự án.

---

# AI

Ban đầu AI được gọi trực tiếp từ Frontend.

Sau đó chuyển sang Backend để:

- Bảo vệ API Key.
- Dễ thay đổi model.
- Dễ bảo trì.
- Tập trung xử lý Prompt.

Đây là một quyết định đúng và nên áp dụng cho mọi dự án tương lai.

---

# Gemini

Trong quá trình phát triển đã phải thay đổi model nhiều lần do Google cập nhật hệ thống.

Kinh nghiệm:

- Không phụ thuộc vào một model cố định.
- Luôn thiết kế để có thể thay model nhanh.

---

# Supabase

Supabase được lựa chọn vì cung cấp đầy đủ:

- PostgreSQL
- Storage
- Authentication (có thể dùng sau)
- Edge Functions

Giúp giảm đáng kể thời gian phát triển.

---

# Storage

Ảnh không lưu trong Database.

Chỉ lưu URL.

Điều này giúp:

- Database nhẹ hơn.
- Dễ quản lý.
- Dễ backup.

---

# Search

Không tìm kiếm trực tiếp trên Database.

Quy trình:

```
Load

↓

allItems

↓

Search

↓

Render
```

Giảm số lượng request.

---

# AI Vision

Luồng hoạt động:

```
Ảnh

↓

Resize

↓

Edge Function

↓

Gemini

↓

JSON

↓

Điền Form
```

AI chỉ hỗ trợ nhập liệu.

Người dùng vẫn là người quyết định dữ liệu cuối cùng.

---

# Refactor

Trong suốt quá trình phát triển đã thực hiện nhiều lần refactor.

Ví dụ:

- Tách module.
- Giảm độ dài file.
- Chuẩn hóa tên hàm.
- Chuẩn hóa luồng xử lý.

Kinh nghiệm:

Refactor sớm sẽ tiết kiệm rất nhiều thời gian về sau.

---

# Những quyết định đúng

- Chia module theo chức năng.
- Dùng Supabase.
- Dùng Edge Function.
- Resize ảnh trước khi upload.
- Tách Prompt khỏi Frontend.
- Dùng GitHub để quản lý mã nguồn.

---

# Những điều có thể làm tốt hơn

Nếu làm lại từ đầu:

- Dùng ES Modules ngay từ đầu.
- Thiết kế State rõ ràng hơn.
- Chuẩn hóa tên hàm sớm hơn.
- Viết tài liệu ngay từ những phiên bản đầu.
- Chuẩn hóa cấu trúc thư mục sớm hơn.

---

# Bài học lớn nhất

Một dự án nhỏ cũng nên:

- Chia module.
- Viết tài liệu.
- Refactor định kỳ.
- Thiết kế để dễ mở rộng.

Điều này giúp việc phát triển lâu dài dễ dàng hơn rất nhiều.

---

# Hướng phát triển

Các phiên bản tiếp theo sẽ tập trung vào:

- AI thông minh hơn.
- Tìm kiếm mạnh hơn.
- Quản lý nhiều loại dữ liệu hơn.
- Đồng bộ tốt hơn.
- Trải nghiệm người dùng tốt hơn.

Storage & Forget không chỉ là một ứng dụng lưu đồ vật, mà còn là nền tảng để thử nghiệm và tích lũy kinh nghiệm phát triển các ứng dụng AI trên nền web.