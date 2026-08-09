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

function openExtraCamera() {

    const input =
        document.getElementById(
            "extraImageInput"
        );

    input.setAttribute(
        "capture",
        "environment"
    );

    input.click();

}

function openExtraGallery() {

    const input =
        document.getElementById(
            "extraImageInput"
        );

    input.removeAttribute(
        "capture"
    );

    input.click();

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
        "📷 " + escapeHtml(file.name);

    if (!editingItem) {

        showActionButtons({
            addCamera: true,
            addGallery: true,
            skip: true,
            cancel: false
        });

    }
    else {

        showActionButtons({
            addCamera: true,
            addGallery: true,
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

    const addCameraBtn =
        document.getElementById(
            "addCameraButton"
        );

    const addGalleryBtn =
        document.getElementById(
            "addGalleryButton"
        );

    const skipBtn =
        document.getElementById(
            "skipButton"
        );

    const cancelBtn =
        document.getElementById(
            "cancelButton"
        );

    if (addCameraBtn) {

        addCameraBtn.style.display =
            opts.addCamera
                ? "inline-block"
                : "none";

    }

    if (addGalleryBtn) {

        addGalleryBtn.style.display =
            opts.addGallery
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

// Dùng Compressor.js tự động nén ảnh + xoay đúng chiều EXIF
async function resizeImage(file) {

    return new Promise(function(resolve) {

        if (typeof Compressor !== "undefined") {

            new Compressor(file, {
                quality: 0.7,
                maxWidth: 1000,
                maxHeight: 1000,
                mimeType: "image/webp",

                success(result) {

                    resolve(result);

                },

                error(err) {

                    console.warn("Compressor.js error, fallback file:", err);

                    resolve(file);

                }
            });

        } else {

            resolve(file);

        }

    });

}
