// Ảnh phụ chưa lưu
let pendingExtraImages = [];

// Số ảnh phụ đã có của món đang sửa
let existingExtraImagesCount = 0;

// Blob URL để preview
let previewUrls = [];


// Chọn thêm ảnh
function openExtraPicker() {

    document
        .getElementById(
            "extraImageInput"
        )
        .click();

}


// Chọn ảnh phụ
function handleExtraImage(event) {

    const files =
        Array.from(
            event.target.files || []
        );

    event.target.value = "";

    if (files.length === 0) {

        return;

    }

    pendingExtraImages.push(
        ...files
    );

    renderPendingExtraImages();

}


// Xóa 1 ảnh chưa lưu
function removePendingExtraImage(index) {

    pendingExtraImages.splice(
        index,
        1
    );

    renderPendingExtraImages();

}


// Hiện ảnh phụ chưa lưu
function renderPendingExtraImages() {

    const strip =
        document.getElementById(
            "pendingExtraStrip"
        );

    if (!strip) {

        return;

    }

    previewUrls.forEach(

        function(url) {

            URL.revokeObjectURL(
                url
            );

        }

    );

    previewUrls = [];

    let html = "";

    pendingExtraImages.forEach(

        function(
            file,
            index
        ) {

            const url =
                URL.createObjectURL(
                    file
                );

            previewUrls.push(
                url
            );

            html +=
                '<div class="extraThumb">' +
                '<img src="' +
                url +
                '">' +
                '<button type="button" onclick="removePendingExtraImage(' +
                index +
                ')">✖</button>' +
                '</div>';

        }

    );

    strip.innerHTML =
        html;

}


// Hiện ảnh phụ đã lưu
function renderExistingExtraImages(images) {

    const strip =
        document.getElementById(
            "existingExtraStrip"
        );

    if (!strip) {

        return;

    }

    let html = "";

    images.forEach(

        function(image) {

            html +=
                '<div class="extraThumb">' +
                '<img src="' +
                image.image_url +
                '">' +
                '</div>';

        }

    );

    strip.innerHTML =
        html;

}


// Reset toàn bộ ảnh phụ
function resetExtraImages() {

    pendingExtraImages = [];

    previewUrls.forEach(

        function(url) {

            URL.revokeObjectURL(
                url
            );

        }

    );

    previewUrls = [];

    const pendingStrip =
        document.getElementById(
            "pendingExtraStrip"
        );

    if (pendingStrip) {

        pendingStrip.innerHTML =
            "";

    }

    const existingStrip =
        document.getElementById(
            "existingExtraStrip"
        );

    if (existingStrip) {

        existingStrip.innerHTML =
            "";

    }

}


// Tải ảnh phụ của 1 món
async function loadItemImages(itemId) {

    const result =
        await db
            .from("item_images")
            .select("*")
            .eq(
                "item_id",
                itemId
            )
            .order(
                "sort_order",
                {
                    ascending:
                        true
                }
            );

    if (result.error) {

        console.warn(
            result.error
        );

        return [];

    }

    return (
        result.data || []
    );

}