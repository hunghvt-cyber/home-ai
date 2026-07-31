// js/database/form.js

function clearForm() {

    selectedFile = null;

    editingItem = null;

    existingExtraImagesCount = 0;



    document
        .getElementById(
            "cameraInput"
        )
        .value = "";



    document
        .getElementById(
            "galleryInput"
        )
        .value = "";



    const extraInput =
        document.getElementById(
            "extraImageInput"
        );

    if (extraInput) {

        extraInput.value = "";

    }



    document
        .getElementById(
            "name"
        )
        .value = "";



    document
        .getElementById(
            "location"
        )
        .value = "";



    document
        .getElementById(
            "room"
        )
        .value = "";



    document
        .getElementById(
            "tags"
        )
        .value = "";



    const description =
        document.getElementById(
            "description"
        );

    if (description) {

        description.value = "";

    }



    document
        .getElementById(
            "selectedImage"
        )
        .innerHTML =
        "Chưa chọn ảnh";



    const preview =
        document.getElementById(
            "preview"
        );

    if (
        preview.src &&
        preview.src.startsWith(
            "blob:"
        )
    ) {

        URL.revokeObjectURL(
            preview.src
        );

    }

    preview.src = "";

    preview.style.display =
        "none";



    if (
        typeof resetExtraImages ===
        "function"
    ) {

        resetExtraImages();

    }



    if (
        typeof showActionButtons ===
        "function"
    ) {

        showActionButtons({

            addCamera: false,

            addGallery: false,

            skip: false,

            cancel: false

        });

    }

}