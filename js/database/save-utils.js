// js/database/save-utils.js
// Hàm tiện ích & xử lý Storage ImageKit

function escapeHtml(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }

    if (
        typeof DOMPurify !==
        "undefined"
    ) {

        return DOMPurify.sanitize(
            String(text)
        );

    }

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


let isSaving = false;


function showSaving(
    saveButton
) {

    isSaving =
        true;

    saveButton.disabled =
        true;

    saveButton.innerHTML =
        "⏳ Đang lưu...";

}


function hideSaving(
    saveButton
) {

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


/* =========================================================
   IMAGEKIT PATH EXTRACTION
   ========================================================= */

function extractStoragePath(
    imageUrl
) {

    if (!imageUrl) {

        return null;

    }


    /*
     * ImageKit:
     *
     * https://ik.imagekit.io/hunghvt/home-ai/file.webp
     *
     * -> home-ai/file.webp
     */

    try {

        const url =
            new URL(
                imageUrl
            );

        const pathname =
            decodeURIComponent(
                url.pathname
            );

        const marker =
            "/home-ai/";

        const index =
            pathname.indexOf(
                marker
            );

        if (
            index !== -1
        ) {

            return pathname.slice(
                index +
                1
            );

        }

    }
    catch (error) {

        console.warn(
            "⚠️ Không parse được ImageKit URL:",
            imageUrl,
            error
        );

    }


    /*
     * Fallback cho URL Supabase cũ.
     * Không dùng cho dữ liệu mới nhưng giữ
     * để tránh lỗi nếu sau này còn URL cũ.
     */

    const oldMarker =
        "/images/";

    const oldIndex =
        imageUrl.indexOf(
            oldMarker
        );

    if (
        oldIndex !== -1
    ) {

        return imageUrl.slice(
            oldIndex +
            oldMarker.length
        );

    }


    return null;

}


/* =========================================================
   DELETE IMAGE
   ========================================================= */

async function deleteStorageImage(
    imageUrl
) {

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


        if (
            result.error
        ) {

            console.error(
                "❌ [Storage Delete Failed]:",
                path,
                result.error
            );

        }

    }
    catch (error) {

        console.error(
            "❌ [Storage Delete Exception]:",
            path,
            error
        );

    }

}
