let isSaving = false;


async function saveItem() {

    if (isSaving) {

        return;

    }

    const data =
        getFormData();

    if (
        !validateForm(data)
    ) {

        return;

    }

    const saveButton =
        document
            .getElementById(
                "saveButton"
            );

    isSaving = true;

    saveButton.disabled =
        true;

    saveButton.innerHTML =
        "⏳ Đang lưu...";

    try {

        if (editingItem) {

            let imageUrl =
                editingItem.image_url;

            const oldImageUrl =
                editingItem.image_url;

            if (selectedFile) {

                imageUrl =
                    await uploadImage(
                        selectedFile
                    );

            }

            const update =
                await db
                    .from("items")
                    .update({

                        name:
                            data.name,

                        location:
                            data.location,

                        room:
                            data.room,

                        tags:
                            data.tags,

                        description:
                            data.description,

                        image_url:
                            imageUrl

                    })
                    .eq(
                        "id",
                        editingItem.id
                    );

            if (update.error) {

                throw update.error;

            }

            if (
                selectedFile &&
                oldImageUrl
            ) {

                await deleteOldImage(
                    oldImageUrl
                );

            }

            if (
                pendingExtraImages.length >
                0
            ) {

                await uploadExtraImages(

                    editingItem.id,

                    pendingExtraImages,

                    existingExtraImagesCount

                );

            }

            clearForm();

            showMessage(
                "✅ Đã cập nhật."
            );

            await loadItems();

        }
        else {

            if (
                !selectedFile
            ) {

                showMessage(
                    "❌ Vui lòng chọn ảnh."
                );

                return;

            }

            const imageUrl =
                await uploadImage(
                    selectedFile
                );

            const insert =
                await db
                    .from("items")
                    .insert([{

                        name:
                            data.name,

                        location:
                            data.location,

                        room:
                            data.room,

                        tags:
                            data.tags,

                        description:
                            data.description,

                        image_url:
                            imageUrl

                    }])
                    .select();

            if (insert.error) {

                throw insert.error;

            }

            const newItem =
                insert.data[0];

            if (
                pendingExtraImages.length >
                0
            ) {

                await uploadExtraImages(

                    newItem.id,

                    pendingExtraImages,

                    0

                );

            }

            clearForm();

            showMessage(
                "✅ Đã lưu."
            );

            await loadItems();

        }

    }
    catch (error) {

        showMessage(
            "❌ " +
            error.message
        );

    }
    finally {

        isSaving = false;

        saveButton.disabled =
            false;

        saveButton.innerHTML =
            "💾 Lưu";

    }

}


function skipItem() {

    if (editingItem) {

        cancelEdit();

        return;

    }

    clearForm();

    showMessage(
        "⏭️ Đã bỏ qua."
    );

    openCamera();

}