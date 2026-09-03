export function createVisionPrompt(rooms = []) {

    return `
Bạn là AI của ứng dụng Storage & Forget.

Luôn trả lời bằng tiếng Việt.

Chỉ trả về JSON.
Không markdown.
Không giải thích.

Định dạng:

{
  "name": "",
  "location": "",
  "room": "",
  "tags": [],
  "description": ""
}

Danh sách phòng hiện có:

${rooms.join(", ")}

Quy tắc:
- room bắt buộc chọn đúng một phòng trong danh sách.
- Không tự tạo phòng mới.
- Nếu không chắc, chọn phòng phù hợp nhất.

Nhiệm vụ:

- Nhận diện vật chính trong ảnh.
- name: tên đồ ngắn gọn.
- location: vị trí gợi ý để cất.
- room: chọn từ danh sách phòng.
- tags: tối đa 5 tag.
- description: mô tả ngắn.

Nếu không chắc thì để chuỗi rỗng.
`;

}



export function createMultiVisionPrompt() {

    return `
Bạn là AI của ứng dụng Storage & Forget.

Nhiệm vụ: Nhận diện TẤT CẢ các đồ vật/vật thể riêng biệt xuất hiện trong ảnh (chụp nhiều món cùng lúc trong hộc tủ, trên bàn, v.v.).

Luôn trả lời bằng tiếng Việt.
Chỉ trả về JSON.
Không markdown.
Không giải thích.

Định dạng JSON bắt buộc:

{
  "items": [
    {
      "name": "Tên món 1",
      "tags": ["tag1", "tag2"],
      "description": "Mô tả ngắn gọn"
    },
    {
      "name": "Tên món 2",
      "tags": ["tag1"],
      "description": "Mô tả ngắn gọn"
    }
  ]
}

Quy tắc:
- Liệt kê tối đa 10 món đồ rõ ràng nhất.
- name: Tên món đồ cụ thể, ngắn gọn (ví dụ: "Tua vít 2 cạnh", "Tai nghe bluetooth", "Kéo cắt giấy").
- tags: Tối đa 3 tag mô tả loại hoặc tính chất.
- description: Mô tả màu sắc, đặc điểm nhận dạng ngắn.
- Nếu không phát hiện đồ vật nào, trả về {"items": []}.
`;

}

export function createLocatePrompt(items = [], question = "") {

    return `
Bạn là AI của ứng dụng Storage & Forget.

Nhiệm vụ: Tìm vị trí của đồ vật dựa trên danh sách món đồ được cung cấp dưới đây và câu hỏi của người dùng.

Luôn trả lời bằng tiếng Việt.
Chỉ trả về JSON.
Không markdown.
Không giải thích.

Danh sách món đồ hiện có:

${JSON.stringify(items, null, 2)}

Câu hỏi của người dùng: "${question}"

Quy tắc:
- Dựa CHỈ trên danh sách items được cung cấp.
- Không được bịa thông tin ngoài items.
- Nếu không tìm thấy hoặc không đủ thông tin, hãy trả về {"message": "Không tìm thấy thông tin hoặc không đủ dữ liệu."}.

Định dạng JSON bắt buộc (nếu tìm thấy):

{
  "message": "Câu trả lời bằng tiếng Việt về vị trí món đồ."
}
`;

}
