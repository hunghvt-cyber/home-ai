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

}

function handleImage(event) {

    const file =
        event.target.files[0];

    if (!file) {

        return;

    }

    selectedFile = file;

    const preview =
        document.getElementById(
            "preview"
        );

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