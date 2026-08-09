// js/database/save-utils.js -> Hàm tiện ích & Bảo mật DOMPurify

function escapeHtml(text) {

    if (text === null || text === undefined) {

        return "";

    }

    if (typeof DOMPurify !== "undefined") {

        return DOMPurify.sanitize(String(text));

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



async function deleteStorageImage(imageUrl) {

    const path =
        extractStoragePath(
            imageUrl
        );

    if (!path) {

        console.warn(
            "⚠️ [Storage Delete Skipped]: Không trích xuất được path từ URL ->",
            imageUrl
        );

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

            console.error(
                "❌ [Storage Delete Failed]: Lỗi khi xóa file ->",
                path,
                result.error
            );

        }

    }
    catch (error) {

        console.error(
            "❌ [Storage Delete Exception]: Lỗi ngoại lệ khi xóa file ->",
            path,
            error
        );

    }

}
