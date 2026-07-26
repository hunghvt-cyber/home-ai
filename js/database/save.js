let isSaving = false;

async function saveItem() {

    if (isSaving) {

        return;

    }

    const name =
        document
            .getElementById("name")
            .value
            .trim();

    if (name === "") {

        showMessage(
            "❌ Nhập tên đồ."
        );

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

        if (editingItem) {

            const update =
                await db
                    .from("items")
                    .update({
                        name: name,
                        location: location
                    })
                    .eq(
                        "id",
                        editingItem.id
                    );

            if (update.error) {

                throw update.error;

            }

            editingItem = null;

            clearForm();

            document
                .getElementById("cancelButton")
                .style.display =
                "none";

            showMessage(
                "✅ Đã cập nhật."
            );

            await loadItems();

        }
        else {

            if (selectedFile == null) {

                showMessage(
                    "❌ Vui lòng chọn ảnh."
                );

                return;

            }

            const resizedBlob =
                await resizeImage(
                    selectedFile
                );

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

            clearForm();

            showMessage(
                "✅ Đã lưu thành công."
            );

            await loadItems();

        }

    }
    catch(error) {

        showMessage(
            "❌ " + error.message
        );

    }
    finally {

        isSaving = false;

        saveButton.disabled = false;

        saveButton.innerHTML =
            "💾 Lưu";

    }

}

function clearForm() {

    selectedFile = null;