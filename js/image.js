let selectedFile = null;

async function openCamera() {

    if (typeof Swal === "undefined") {
        const input = document.getElementById("cameraImageInput");
        if (input) input.click();
        return;
    }

    const result = await Swal.fire({
        title: "📷 1 món",
        text: "Chọn cách lấy ảnh",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "📷 Chụp ảnh",
        denyButtonText: "🖼️ Chọn album",
        cancelButtonText: "Hủy",
        reverseButtons: true
    });

    if (result.isConfirmed) {
        document.getElementById("cameraImageInput")?.click();
    } else if (result.isDenied) {
        document.getElementById("galleryImageInput")?.click();
    }

}

function openExtraImage() {

    const input = document.getElementById("extraImageInput");

    if (input) {
        input.click();
    }

}

function initImage() {

    document
        .getElementById("cameraImageInput")
        .addEventListener(
            "change",
            handleImage
        );

    document
        .getElementById("galleryImageInput")
        .addEventListener(
            "change",
            handleImage
        );

    // Backward compatibility for any existing caller using imageInput.
    document
        .getElementById("imageInput")
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
            addImage: true,
            skip: true,
            cancel: false
        });

    }
    else {

        showActionButtons({
            addImage: true,
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

    const addImageBtn =
        document.getElementById(
            "addImageButton"
        );

    const skipBtn =
        document.getElementById(
            "skipButton"
        );

    const cancelBtn =
        document.getElementById(
            "cancelButton"
        );

    if (addImageBtn) {

        addImageBtn.style.display =
            opts.addImage
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

// Temporary AI copies only. The original file is never modified.
const AI_IMAGE_PROFILES = {
    fast: {
        maxDimension: 1024,
        quality: 0.72
    },
    detail: {
        maxDimension: 1600,
        quality: 0.78
    }
};

async function resizeImage(file, profile = "fast") {

    const config =
        AI_IMAGE_PROFILES[profile] ||
        AI_IMAGE_PROFILES.fast;

    return new Promise(function(resolve) {

        if (typeof Compressor === "undefined") {
            resolve(file);
            return;
        }

        new Compressor(file, {
            quality: config.quality,
            maxWidth: config.maxDimension,
            maxHeight: config.maxDimension,
            mimeType: "image/webp",
            convertSize: 0,

            success(result) {
                resolve(result);
            },

            error(err) {
                console.warn("Compressor.js error, fallback file:", err);
                resolve(file);
            }
        });

    });

}
