# Database & Storage

Storage & Forget sử dụng Supabase PostgreSQL làm cơ sở dữ liệu chính và Supabase Storage Bucket để lưu trữ tệp hình ảnh.

---

# Bảng dữ liệu (Database Schema)

### 1. Bảng `items` (Lưu danh sách đồ đạc)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `bigint` / `uuid` | Primary Key, Auto Increment | ID định danh duy nhất cho món đồ |
| `name` | `text` | NOT NULL | Tên đồ đạc |
| `location` | `text` | Nullable | Vị trí chi tiết (ví dụ: Hộc tủ 2, Kệ sách) |
| `room` | `text` | Nullable | Tên phòng cất giữ (ví dụ: Phòng khách) |
| `tags` | `text[]` / `jsonb` | Nullable | Mảng chứa các thẻ đánh dấu |
| `description` | `text` | Nullable | Mô tả chi tiết món đồ |
| `image_url` | `text` | Nullable | URL công khai của ảnh đại diện chính |
| `created_at` | `timestamptz` | Default `now()` | Thời gian tạo bản ghi |
| `previous_room`| `text` | Nullable | Lưu vết phòng cũ trước khi bị đưa vào Thùng rác |
| `trashed_at` | `timestamptz` | Nullable | Thời điểm món đồ bị đưa vào Thùng rác |

### 2. Bảng `rooms` (Danh sách phòng)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `bigint` / `uuid` | Primary Key, Auto Increment | ID phòng |
| `name` | `text` | UNIQUE, NOT NULL | Tên phòng (ví dụ: Phòng ngủ, Bếp) |

### 3. Bảng `item_images` (Danh sách ảnh phụ)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `bigint` / `uuid` | Primary Key, Auto Increment | ID bản ghi ảnh phụ |
| `item_id` | `bigint` / `uuid` | FK `items(id)` ON DELETE CASCADE | Liên kết tới món đồ thuộc bảng `items` |
| `image_url` | `text` | NOT NULL | URL công khai của ảnh phụ |
| `sort_order` | `integer` | Default `0` | Thứ tự sắp xếp ảnh phụ |

---

# Quy trình Upload & Quản lý Storage
Client (Compressor.js) ──► Nén WebP ──► Tải lên Storage Bucket ('images') ──► Trả về publicUrl


- **Quy tắc đặt tên file**: `Date.now() + "_" + randomSuffix + "_" + cleanFileName + ".webp"`.
- **Định dạng tối ưu**: Tất cả ảnh tải lên đều được nén về định dạng WebP với chất lượng 0.7 và kích thước tối đa 1000px.

---

# Dọn dẹp Storage Mồ côi (`cleanOrphanedStorageFiles`)

Khi xóa vĩnh viễn món đồ hoặc khi làm sạch thùng rác:
1. Ứng dụng trích xuất danh sách tất cả các `image_url` đang được liên kết trong bảng `items` và `item_images`.
2. Truy vấn danh sách toàn bộ file thực tế đang lưu trữ trên Bucket `images`.
3. So sánh và lọc ra các file "mồ côi" (có trên Storage nhưng không tồn tại trong DB) và thực hiện xoá triệt để khỏi Storage, giải phóng dung lượng.