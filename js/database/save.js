let isSaving = false;

async function saveItem() {

    if (isSaving) {

        return;

    }

    if (selectedFile == null) {

        showMessage("❌ Vui lòng chọn ảnh.");

        return;

    }

    const name =
        document
            .getElementById("name")
            .value
            .trim();

    if (name === "") {

        showMessage("❌ Nhập tên đồ.");

        return;

    }

    const location =
        document
            .getElementById("location")
            .value
            .trim();

    const saveButton =
        document
            .getElementById("saveButton");

    isSaving = true;

    saveButton.disabled = true;

    saveButton.innerHTML =
        "⏳ Đang lưu...";

    try {

        const resizedBlob =
            await resizeImage(selectedFile);

        const fileName =
            Date.now() +
            "_" +
            selectedFile.name
                .replace(/\s/g, "_")
                .replace(/\.[^/.]+$/, "") +
            ".jpg";

        const upload =
            await db.storage
                .from("images")
                .upload(
                    fileName,
                    resizedBlob,
                    {
                        contentType:
                            "image/jpeg"
                    }
                );

        if (upload.error) {

            throw upload.error;

        }

        const imageUrl =
            db.storage
                .from("images")
                .getPublicUrl(fileName)
                .data.publicUrl;

        const insert =
            await db
                .from("items")
                .insert([
                    {
                        name: name,
                        location: location,
                        image_url: imageUrl
                    }
                ]);

        if (insert.error) {

            throw insert.error;

        }

        showMessage(
            "✅ Đã lưu thành công."
        );

        clearForm();

        await loadItems();

    } catch (error) {

        showMessage(
            "❌ " + error.message
        );

    } finally {

        isSaving = false;

        saveButton.disabled = false;

        saveButton.innerHTML =
            "💾 Lưu";

    }

}

function clearForm() {

    selectedFile = null;

    document
        .getElementById("cameraInput")
        .value = "";

    document
        .getElementById("galleryInput")
        .value = "";

    document
        .getElementById("name")
        .value = "";

    document
        .getElementById("location")
        .value = "";

    document
        .getElementById("selectedImage")
        .innerHTML =
        "Chưa chọn ảnh";

    const preview =
        document
            .getElementById("preview");

    preview.src = "";

    preview.style.display =
        "none";

}