let selectedFile = null;

function openCamera() {

    document
        .getElementById("cameraInput")
        .click();

}

function openGallery() {

    document
        .getElementById("galleryInput")
        .click();

}

function initImage() {

    document
        .getElementById("cameraInput")
        .addEventListener(
            "change",
            selectImage
        );

    document
        .getElementById("galleryInput")
        .addEventListener(
            "change",
            selectImage
        );

}

function selectImage(event) {

    if (
        event.target.files.length === 0
    ) {

        return;

    }

    selectedFile =
        event.target.files[0];

    showMessage(
        "⏳ Đang xử lý ảnh..."
    );

    document
        .getElementById("selectedImage")
        .innerHTML =
        "✅ " +
        selectedFile.name +
        "<br>" +
        formatSize(
            selectedFile.size
        );

    const reader =
        new FileReader();

    reader.onload = function(e) {

        const img =
            document.getElementById(
                "preview"
            );

        img.onload = function() {

            showMessage(
                "✅ Đã chọn ảnh."
            );

        };

        img.src =
            e.target.result;

        img.style.display =
            "block";

    };

    reader.readAsDataURL(
        selectedFile
    );

}

function formatSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";

    }

    return (
        bytes / 1024 / 1024
    ).toFixed(2) + " MB";

}
function resizeImage(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();

        reader.onload = function(e) {

            const img =
                new Image();

            img.onload = function() {

                let width =
                    img.width;

                let height =
                    img.height;

                const maxSize = 1600;

                if (
                    width > height &&
                    width > maxSize
                ) {

                    height =
                        height *
                        maxSize /
                        width;

                    width =
                        maxSize;

                }

                if (
                    height >= width &&
                    height > maxSize
                ) {

                    width =
                        width *
                        maxSize /
                        height;

                    height =
                        maxSize;

                }

                const canvas =
                    document.createElement(
                        "canvas"
                    );

                canvas.width =
                    width;

                canvas.height =
                    height;

                const ctx =
                    canvas.getContext(
                        "2d"
                    );

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob(

                    function(blob) {

                        resolve(blob);

                    },

                    "image/jpeg",

                    0.85

                );

            };

            img.onerror =
                reject;

            img.src =
                e.target.result;

        };

        reader.onerror =
            reject;

        reader.readAsDataURL(
            file
        );

    });

}