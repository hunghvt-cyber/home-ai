# Architecture

Storage & Forget được thiết kế theo hướng **Module-based Architecture** sử dụng HTML, CSS và Vanilla JavaScript.

Mục tiêu là giữ mã nguồn đơn giản, dễ đọc, dễ bảo trì và có thể mở rộng mà không cần framework.

---

# Tổng quan

```
User
 │
 ▼
UI (index.html)
 │
 ▼
Application (app.js)
 │
 ├──────────────┬──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼              ▼
Image       Database       Search         Rooms          AI
 │              │              │              │              │
 └──────────────┴──────────────┴──────────────┴──────────────┘
                         │
                         ▼
                    Supabase
                Database + Storage
                         │
                         ▼
                 Edge Function (Gemini)
                         │
                         ▼
                    Google Gemini
```

---

# Thư mục

```
api/
```

Chứa các thành phần liên quan đến AI.

- gemini.js
- prompt.js
- response.js

Đây là lớp giao tiếp giữa Frontend và AI.

---

```
css/
```

Chứa toàn bộ giao diện.

---

```
js/
```

Là thư mục chính của ứng dụng.

Được chia theo từng chức năng thay vì chia theo loại file.

```
js/
├── ai/
├── database/
├── rooms/
├── search/
├── app.js
├── config.js
├── image.js
└── message.js
```

---

# app.js

Điểm khởi động của toàn bộ ứng dụng.

Chịu trách nhiệm:

- Khởi tạo module
- Điều phối luồng khởi động
- Bắt lỗi toàn cục

Không chứa business logic.

---

# config.js

Quản lý cấu hình.

Bao gồm:

- Supabase
- Storage
- URL
- Các hằng số dùng chung

---

# image.js

Quản lý vòng đời của ảnh.

Bao gồm:

- Chọn ảnh
- Preview
- Resize
- Chuẩn bị upload

Không xử lý Database.

Không xử lý AI.

---

# message.js

Hiển thị thông báo.

Toàn bộ project sử dụng chung một hệ thống Message.

---

# database/

Đây là trung tâm của ứng dụng.

Các file được tách theo từng nghiệp vụ.

```
save.js
```

Lưu dữ liệu.

```
load.js
```

Đọc dữ liệu.

```
render.js
```

Hiển thị dữ liệu.

```
edit.js
```

Chỉnh sửa.

```
delete.js
```

Xóa dữ liệu.

Việc tách từng thao tác thành từng file giúp mã nguồn dễ đọc hơn rất nhiều.

---

# search/

Chứa toàn bộ chức năng tìm kiếm và lọc.

Không truy cập trực tiếp Database.

Hoạt động trên dữ liệu đã được tải.

---

# rooms/

Quản lý:

- Danh sách phòng
- Thống kê

Được tách riêng khỏi Database để dễ mở rộng.

---

# ai/

Chứa các chức năng AI.

Bao gồm:

- Vision
- Chat
- Suggest

Các module AI độc lập với Database.

---

# api/

Chứa Prompt và xử lý dữ liệu AI.

Giúp Frontend không phải xây dựng Prompt trực tiếp.

---

# Edge Function

Frontend không gọi Gemini trực tiếp.

Luồng hoạt động:

```
Browser
      │
      ▼
Edge Function
      │
      ▼
Gemini API
      │
      ▼
Browser
```

Điều này giúp:

- Bảo mật API Key.
- Dễ đổi model.
- Dễ bổ sung xác thực.
- Quản lý request tập trung.

---

# Luồng lưu đồ vật

```
User

↓

Chọn ảnh

↓

Resize

↓

Upload Storage

↓

Lưu Database

↓

Reload danh sách

↓

Render giao diện
```

---

# Luồng AI Vision

```
Chọn ảnh

↓

Resize

↓

Edge Function

↓

Gemini

↓

JSON

↓

Điền dữ liệu vào Form
```

---

# Luồng tìm kiếm

```
Supabase

↓

allItems

↓

Search

↓

Filter

↓

Render
```

Không query lại Database.

---

# Nguyên tắc thiết kế

Storage & Forget được xây dựng dựa trên các nguyên tắc:

- Một file chỉ đảm nhiệm một trách nhiệm chính.
- Tách giao diện và xử lý nghiệp vụ.
- Hạn chế lặp mã.
- Ưu tiên module nhỏ.
- Dễ refactor.
- Dễ mở rộng.

---

# Điểm mạnh

- Module rõ ràng.
- Luồng dữ liệu đơn giản.
- AI tách riêng.
- Database tách riêng.
- Có Edge Function.
- Dễ bảo trì.
- Dễ bổ sung tính năng.

---

# Có thể cải thiện

Trong tương lai có thể xem xét:

- ES Modules.
- Event Bus.
- TypeScript.
- State Management.
- Unit Test.

Tuy nhiên với quy mô hiện tại, kiến trúc hiện tại đã đáp ứng tốt yêu cầu của dự án.