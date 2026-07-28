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



            if (selectedFile) {


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



                imageUrl =
                    db.storage
                        .from("images")
                        .getPublicUrl(
                            fileName
                        )
                        .data
                        .publicUrl;

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
                    .getPublicUrl(
                        fileName
                    )
                    .data
                    .publicUrl;



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