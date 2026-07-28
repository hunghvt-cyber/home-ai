# Database

Storage & Forget sử dụng Supabase PostgreSQL làm cơ sở dữ liệu chính.

Ảnh được lưu trên Supabase Storage.

Database chỉ lưu thông tin mô tả và đường dẫn ảnh.

---

# Kiến trúc

```
Browser
    │
    ▼
Supabase Client
    │
    ▼
PostgreSQL
```

Ảnh:

```
Browser

↓

Storage Bucket

↓

Public URL

↓

Database
```

---

# Bảng chính

Hiện tại ứng dụng sử dụng một bảng chính để lưu đồ vật.

Mỗi bản ghi gồm các thông tin như:

- Tên
- Phòng
- Vị trí
- URL ảnh
- Thời gian tạo

Khóa chính sử dụng ID tự tăng.

---

# Storage

Ảnh không lưu trong Database.

Quy trình:

```
Resize

↓

Upload

↓

Public URL

↓

INSERT Database
```

Điều này giúp:

- Database nhỏ hơn.
- Backup dễ hơn.
- Truy cập ảnh nhanh hơn.
- Không làm tăng kích thước bản ghi.

---

# Luồng Save

```
Form

↓

Validate

↓

Upload Image

↓

Insert Item

↓

Reload

↓

Render
```

---

# Luồng Load

```
SELECT

↓

allItems

↓

Search

↓

Filter

↓

Render
```

Dữ liệu sau khi tải sẽ được lưu trong bộ nhớ (`allItems`) để các chức năng khác sử dụng.

---

# Luồng Edit

```
Chọn Item

↓

Cập nhật dữ liệu

↓

UPDATE

↓

Reload

↓

Render
```

---

# Luồng Delete

```
Chọn Item

↓

DELETE Database

↓

DELETE Storage

↓

Reload

↓

Render
```

Việc xóa cần đảm bảo cả bản ghi và ảnh được đồng bộ.

---

# Caching

Ứng dụng chỉ tải dữ liệu khi cần.

Sau khi tải:

```
Supabase

↓

allItems[]

↓

Search

↓

Filter

↓

Rooms

↓

Statistics
```

Điều này giúp giảm số lượng request.

---

# Thiết kế

Database chỉ chịu trách nhiệm:

- Lưu.
- Đọc.
- Cập nhật.
- Xóa.

Không xử lý:

- AI
- Search
- Render
- UI

---

# Ưu điểm

- Kiến trúc đơn giản.
- Ít bảng.
- Dễ mở rộng.
- Dễ backup.
- Dễ bảo trì.

---

# Kinh nghiệm

Trong quá trình phát triển rút ra một số kinh nghiệm:

- Upload ảnh trước khi INSERT.
- Chỉ lưu URL ảnh.
- Không lưu Base64 trong Database.
- Tách từng thao tác CRUD thành từng module.
- Hạn chế query lặp lại.

---

# Có thể cải thiện

Trong tương lai có thể bổ sung:

- Soft Delete.
- Audit Log.
- Version History.
- Đồng bộ ngoại tuyến.
- Batch Update.
- Pagination khi số lượng dữ liệu lớn.

Với quy mô hiện tại, cấu trúc Database đáp ứng tốt yêu cầu của dự án và vẫn còn nhiều khả năng mở rộng.