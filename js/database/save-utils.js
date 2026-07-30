// js/database/save-utils.js

let isSaving = false;



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



async function deleteOldImage(imageUrl) {

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



function showSaving(saveButton) {

    isSaving = true;

    saveButton.disabled =
        true;

    saveButton.innerHTML =
        "⏳ Đang lưu...";

}



function hideSaving(saveButton) {

    isSaving = false;

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