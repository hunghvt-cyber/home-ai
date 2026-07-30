// js/database/save-extra.js

async function uploadExtraImages(
    itemId,
    files,
    startOrder
) {

    for (
        let i = 0;
        i < files.length;
        i++
    ) {

        const imageUrl =
            await uploadImage(
                files[i]
            );

        const result =
            await db
                .from(
                    "item_images"
                )
                .insert([

                    {

                        item_id:
                            itemId,

                        image_url:
                            imageUrl,

                        sort_order:
                            startOrder + i

                    }

                ]);

        if (result.error) {

            console.warn(
                result.error
            );

        }

    }

}