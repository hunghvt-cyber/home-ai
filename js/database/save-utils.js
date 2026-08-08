// js/database/save-utils.js -> Hàm tiện ích

function escapeHtml(text) {

    if (text === null || text === undefined) {

        return "";

    }

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}



let isSaving = false;



function showSaving(saveButton) {

    isSaving =
        true;

    saveButton.disabled =
        true;

    saveButton.innerHTML =
        "⏳ Đang lưu...";

}



function hideSaving(saveButton) {

    isSaving =
        false;

    saveButton.disabled =
        false;

    saveButton.innerHTML =
        "💾 Lưu";

}



function getFormData() {

    const tagsInput =
        document
            .getElementById(
                "tags"
            )
            .value
            .trim();

    return {

        name:
            document
                .getElementById(
                    "name"
                )
                .value
                .trim(),

        location:
            document
                .getElementById(
                    "location"
                )
                .value
                .trim(),

        room:
            document
                .getElementById(
                    "room"
                )
                .value,

        description:
            document
                .getElementById(
                    "description"
                )
                .value
                .trim(),

        tags:

            tagsInput

                ? tagsInput
                    .split(",")
                    .map(
                        t =>
                            t.trim()
                    )
                    .filter(
                        t =>
                            t !== ""
                    )

                : []

    };

}



// Lấy đúng tên file (path trong bucket Storage) từ public URL
function extractStoragePath(imageUrl) {

    if (!imageUrl) {

        return null;

    }

    const marker =
        "/images/";

    const index =
        imageUrl.indexOf(
            marker
        );

    if (index === -1) {

        return null;

    }

    return imageUrl.slice(
        index +
        marker.length
    );

}



// Xoá 1 file ảnh trong Storage theo public URL
async function deleteStorageImage(imageUrl) {

    const path =
        extractStoragePath(
            imageUrl
        );

    if (!path) {

        return;

    }

    try {

        const result =
            await db.storage
                .from(
                    "images"
                )
                .remove([
                    path
                ]);

        if (result.error) {

            console.warn(
                result.error
            );

        }

    }
    catch (error) {

        console.warn(
            error
        );

    }

}
