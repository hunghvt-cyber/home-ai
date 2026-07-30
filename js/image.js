let selectedFile = null;

function openCamera() {

    document
        .getElementById(
            "cameraInput"
        )
        .click();

}

function openGallery() {

    document
        .getElementById(
            "galleryInput"
        )
        .click();

}

function openExtraPicker() {

    document
        .getElementById(
            "extraImageInput"
        )
        .click();

}

function initImage() {

    document
        .getElementById(
            "cameraInput"
        )
        .addEventListener(
            "change",
            handleImage
        );

    document
        .getElementById(
            "galleryInput"
        )
        .addEventListener(
            "change",
            handleImage
        );

    document
        .getElementById(
            "extraImageInput"
        )
        .addEventListener(
            "change",
            handleExtraImage
        );

}

function handleImage(event) {

    const file =
        event.target.files[0];

    event.target.value = "";

    if (!file) {

        return;

    }

    selectedFile = file;

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

    preview.src =
        URL.createObjectURL(file);

    preview.style.display =
        "block";

    document
        .getElementById(
            "selectedImage"
        )
        .innerHTML =
        "📷 " + file.name;

    // Bắt đầu 1 món mới (chưa lưu) -> hiện nút Thêm ảnh / Bỏ qua
    if (!editingItem) {

        showActionButtons({
            addPhoto: true,
            skip: true,
            cancel: false
        });

    }
    else {

        showActionButtons({
            addPhoto: true,
            skip: false,
            cancel: true
        });

    }

}

function handleExtraImage(event) {

    const files =
        Array.from(
            event.target.files || []
        );

    event.target.value = "";

    if (files.length === 0) {

        return;

    }

    files.forEach(function(file) {

        pendingExtraImages.push(file);

    });

    renderPendingExtraImages();

}

function showActionButtons(opts) {

    const addBtn =
        document.getElementById(
            "addPhotoButton"
        );

    const skipBtn =
        document.getElementById(
            "skipButton"
        );

    const cancelBtn =
        document.getElementById(
            "cancelButton"
        );

    if (addBtn) {

        addBtn.style.display =
            opts.addPhoto
                ? "inline-block"
                : "none";

    }

    if (skipBtn) {

        skipBtn.style.display =
            opts.skip
                ? "inline-block"
                : "none";

    }

    if (cancelBtn) {

        cancelBtn.style.display =
            opts.cancel
                ? "inline-block"
                : "none";

    }

}

async function resizeImage(file) {

    return new Promise(
        function(resolve) {

            const img =
                new Image();

            const objectUrl =
                URL.createObjectURL(
                    file
                );

            img.onload =
                function() {

                    URL.revokeObjectURL(
                        objectUrl
                    );

                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    const maxSize =
                        800;

                    let width =
                        img.width;

                    let height =
                        img.height;

                    // Chỉ resize khi ảnh lớn hơn maxSize,
                    // không phóng to ảnh vốn đã nhỏ hơn 800px
                    if (
                        width > maxSize ||
                        height > maxSize
                    ) {

                        if (
                            width > height
                        ) {

                            height =
                                height *
                                maxSize /
                                width;

                            width =
                                maxSize;

                        }
                        else {

                            width =
                                width *
                                maxSize /
                                height;

                            height =
                                maxSize;

                        }

                    }

                    canvas.width =
                        width;

                    canvas.height =
                        height;

                    canvas
                        .getContext("2d")
                        .drawImage(
                            img,
                            0,
                            0,
                            width,
                            height
                        );

                    canvas.toBlob(

                        function(blob) {

                            // Nếu resize lỗi (blob null hiếm gặp),
                            // vẫn upload được ảnh gốc thay vì crash
                            if (!blob) {

                                resolve(file);

                                return;

                            }

                            resolve(blob);

                        },

                        "image/webp",

                        0.65

                    );

                };

            img.src =
                objectUrl;

        }

    );

}