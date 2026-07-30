
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


// Xóa 1 ảnh trong Supabase Storage
async function deleteOldImage(imageUrl) {

    const path =
        extractStoragePath(
            imageUrl
        );

    if (!path) {

        return;

    }

    try {

        const { error } =
            await db.storage
                .from("images")
                .remove([
                    path
                ]);

        if (error) {

            console.warn(
                "Không xoá được ảnh:",
                error
            );

        }

    }
    catch (error) {

        console.warn(
            "Không xoá được ảnh:",
            error
        );

    }

}


// Xóa toàn bộ ảnh phụ của 1 món
async function deleteAllItemImagesStorage(itemId) {

    const result =
        await db
            .from("item_images")
            .select(
                "image_url"
            )
            .eq(
                "item_id",
                itemId
            );

    if (result.error) {

        console.warn(
            result.error
        );

        return;

    }

    for (const image of result.data) {

        await deleteOldImage(
            image.image_url
        );

    }

}