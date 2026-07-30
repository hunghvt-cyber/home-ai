let isSaving = false;


// Tách logic resize + upload + lấy public URL thành 1 hàm dùng chung
async function uploadImage(file) {

    const resizedBlob =
        await resizeImage(file);

    const randomSuffix =
        Math.random()
            .toString(36)
            .slice(2, 8);

    const fileName =
        Date.now() +
        "_" +
        randomSuffix +
        "_" +
        file.name
            .replace(/\s/g, "_")
            .replace(/\.[^/.]+$/, "") +
        ".webp";

    const upload =
        await db.storage
            .from("images")
            .upload(
                fileName,
                resizedBlob,
                {
                    contentType:
                        "image/webp"
                }
            );

    if (upload.error) {

        throw upload.error;

    }

    const imageUrl =
        db.storage
            .from("images")
            .getPublicUrl(
                fileName
            )
            .data
            .publicUrl;

    return imageUrl;

}


// Lấy đúng tên file (path trong bucket) từ public URL để xoá
function extractStoragePath(imageUrl) {

    if (!imageUrl) {

        return null;

    }

    const marker =
        "/images/";

    const index =
        imageUrl.indexOf(marker);

    if (index === -1) {

        return null;

    }

    return imageUrl.slice(
        index + marker.length
    );

}


// Xoá ảnh cũ trong Storage, không chặn luồng chính nếu lỗi
async function deleteOldImage(imageUrl) {

    const path =
        extractStoragePath(imageUrl);

    if (!path) {

        return;

    }

    try {

        const { error } =
            await db.storage
                .from("images")
                .remove([path]);

        if (error) {

            console.warn(
                "Không xoá được ảnh cũ:",
                error
            );

        }

    }
    catch (error) {

        console.warn(
            "Không xoá được ảnh cũ:",
            error
        );

    }

}


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



    const room =
        document
            .getElementById("room")
            .value;



    const tagsInput =
        document
            .getElementById("tags")
            .value
            .trim();



    const description =
        document
            .getElementById("description")
            .value
            .trim();



    const tags =
        tagsInput
            ? tagsInput
                .split(",")
                .map(
                    t => t.trim()
                )
                .filter(
                    t => t !== ""
                )
            : [];



    const saveButton =
        document
            .getElementById("saveButton");



    isSaving = true;

    saveButton.disabled = true;

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
                            name,

                        location:
                            location,

                        room:
                            room,

                        tags:
                            tags,

                        description:
                            description,

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



            // Chỉ xoá ảnh cũ sau khi update thành công,
            // và chỉ khi thực sự có ảnh mới thay thế
            if (
                selectedFile &&
                oldImageUrl
            ) {

                await deleteOldImage(
                    oldImageUrl
                );

            }



            clearForm();

            showMessage(
                "✅ Đã cập nhật."
            );

            await loadItems();

        }
        else {


            if (!selectedFile) {

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
                    .insert([

                        {

                            name:
                                name,

                            location:
                                location,

                            room:
                                room,

                            tags:
                                tags,

                            description:
                                description,

                            image_url:
                                imageUrl

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
    catch (error) {

        showMessage(
            "❌ " +
            error.message
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

    editingItem = null;



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
        .getElementById("room")
        .value = "";



    document
        .getElementById("tags")
        .value = "";



    const description =
        document.getElementById(
            "description"
        );

    if (description) {

        description.value = "";

    }



    document
        .getElementById("selectedImage")
        .innerHTML =
        "Chưa chọn ảnh";



    const preview =
        document.getElementById(
            "preview"
        );

    if (
        preview.src &&
        preview.src.startsWith("blob:")
    ) {

        URL.revokeObjectURL(
            preview.src
        );

    }

    preview.src = "";

    preview.style.display =
        "none";



    document
        .getElementById(
            "cancelButton"
        )
        .style.display =
        "none";

}