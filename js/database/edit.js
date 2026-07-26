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

    document
        .getElementById("cancelButton")
        .style.display =
        "inline-block";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

    document
        .getElementById("name")
        .focus();

    showMessage(
        "✏️ Đang chỉnh sửa."
    );

}

function cancelEdit() {

    editingItem = null;

    clearForm();

    document
        .getElementById("saveButton")
        .innerHTML =
        "💾 Lưu";

    document
        .getElementById("cancelButton")
        .style.display =
        "none";

    showMessage(
        "✅ Đã hủy chỉnh sửa."
    );

}