let editingItem = null;

function editItem(id) {

    const item =
        allItems.find(
            x => x.id === id
        );

    if (!item) {

        showMessage(
            "❌ Không tìm thấy dữ liệu."
        );

        return;

    }

    editingItem = item;

    document
        .getElementById("name")
        .value =
        item.name || "";

    document
        .getElementById("location")
        .value =
        item.location || "";

    document
        .getElementById("saveButton")
        .innerHTML =
        "💾 Cập nhật";

    showMessage(
        "✏️ Đang chỉnh sửa."
    );

}