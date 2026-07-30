let editingItem = null;


function fillForm(item) {

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

}


async function loadEditImages(itemId) {

    resetExtraImages();

    const images =
        await loadItemImages(
            itemId
        );

    existingExtraImagesCount =
        images.length;

    renderExistingExtraImages(
        images
    );

}


function enterEditMode() {

    showActionButtons({

        addPhoto: true,

        skip: false,

        cancel: true

    });

    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });

    showMessage(
        "✏️ Đang chỉnh sửa."
    );

}


async function editItem(id) {

    const item =
        allItems.find(

            x =>
                x.id == id

        );

    if (!item) {

        showMessage(
            "❌ Không tìm thấy dữ liệu."
        );

        return;

    }

    editingItem =
        item;

    fillForm(item);

    await loadEditImages(
        item.id
    );

    enterEditMode();

}


function cancelEdit() {

    clearForm();

    showMessage(
        "❎ Đã hủy chỉnh sửa."
    );

}