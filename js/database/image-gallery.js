// js/database/image-gallery.js

let pendingExtraImages = [];

let previewUrls = [];

let existingExtraImagesCount = 0;



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
                    ascending: true
                }
            );

    if (result.error) {

        console.warn(
            result.error
        );

        return [];

    }

    return result.data || [];

}



// Tải TOÀN BỘ ảnh phụ của mọi món trong 1 lần gọi (dùng cho màn hình danh sách,
// tránh phải query riêng cho từng món -> đỡ tốn request)
async function loadAllExtraImagesMap() {

    const result =
        await db
            .from("item_images")
            .select("*")
            .order(
                "sort_order",
                {
                    ascending: true
                }
            );

    if (result.error) {

        console.warn(
            result.error
        );

        return {};

    }

    const map = {};

    (result.data || []).forEach(
        function(img) {

            if (!map[img.item_id]) {

                map[img.item_id] = [];

            }

            map[img.item_id].push(
                img
            );

        }
    );

    return map;

}



function renderExistingExtraImages(images) {

    const strip =
        document.getElementById(
            "existingExtraStrip"
        );

    if (!strip) {

        return;

    }

    let html = "";

    images.forEach(function(img) {

        html +=
            '<div class="extraThumb">' +
            '<img src="' +
            escapeHtml(img.image_url) +
            '">' +
            "</div>";

    });

    strip.innerHTML =
        html;

}



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

        function(file, index) {

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
                escapeHtml(url) +
                '">' +
                '<button type="button" onclick="removePendingExtraImage(' +
                index +
                ')">✖</button>' +
                "</div>";

        }

    );

    strip.innerHTML =
        html;

}



function removePendingExtraImage(index) {

    pendingExtraImages.splice(
        index,
        1
    );

    renderPendingExtraImages();

}



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

    const pending =
        document.getElementById(
            "pendingExtraStrip"
        );

    if (pending) {

        pending.innerHTML =
            "";

    }

    const existing =
        document.getElementById(
            "existingExtraStrip"
        );

    if (existing) {

        existing.innerHTML =
            "";

    }

}
