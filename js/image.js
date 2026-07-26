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

            img.onload =
                function() {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    const maxSize =
                        1280;

                    let width =
                        img.width;

                    let height =
                        img.height;

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
                    else if (
                        height > maxSize
                    ) {

                        width =
                            width *
                            maxSize /
                            height;

                        height =
                            maxSize;

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

                            resolve(blob);

                        },

                        "image/jpeg",

                        0.8

                    );

                };

            img.src =
                URL.createObjectURL(
                    file
                );

        }

    );

}