let editingItem = null;



async function editItem(id) {

    const item =
        allItems.find(
            x => x.id == id
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
        .getElementById("room")
        .value =
        item.room || "";



    document
        .getElementById("tags")
        .value =
        Array.isArray(item.tags)
            ? item.tags.join(", ")
            : "";



    const description =
        document.getElementById(
            "description"
        );



    if (description) {

        description.value =
            item.description || "";

    }



    const preview =
        document.getElementById(
            "preview"
        );



    preview.src =
        item.image_url || "";



    preview.style.display =
        item.image_url
            ? "block"
            : "none";



    document
        .getElementById(
            "selectedImage"
        )
        .innerHTML =
        item.name ||
        "Đang sửa";



    document
        .getElementById(
            "cancelButton"
        )
        .style.display =
        "inline-block";



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });



    showMessage(
        "✏️ Đang chỉnh sửa."
    );

}





function cancelEdit() {

    clearForm();

    showMessage(
        "❎ Đã hủy chỉnh sửa."
    );

}