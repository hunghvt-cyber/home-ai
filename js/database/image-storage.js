// js/database/image-storage.js

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



async function deleteAllItemImagesStorage(itemId) {

    const result =

        await db

            .from(
                "item_images"
            )

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

        await deleteStorageImage(
            image.image_url
        );

    }

}