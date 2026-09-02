// js/database/save-extra.js -> Ảnh phụ (upload / xoá)

// Upload các ảnh phụ đang chờ (pendingExtraImages) và ghi vào bảng item_images
async function uploadExtraImages(
    itemId,
    files,
    startOrder = 0
) {

    const UPLOAD_CONCURRENCY = 3;

    for (
        let i = 0;
        i < files.length;
        i += UPLOAD_CONCURRENCY
    ) {

        const chunk =
            files.slice(
                i,
                i + UPLOAD_CONCURRENCY
            );

        await Promise.all(
            chunk.map(async (file, offset) => {

                const sortIndex =
                    i + offset;

                const imageUrl =
                    await uploadImage(
                        file
                    );

                const result =
                    await db
                        .from("item_images")
                        .insert([
                            {
                                item_id: itemId,
                                image_url: imageUrl,
                                sort_order: startOrder + sortIndex
                            }
                        ]);

                if (result.error) {

                    console.warn(
                        result.error
                    );

                }

            })
        );

    }

}



// Xoá toàn bộ file ảnh phụ trong Storage của 1 món đồ
// (dùng khi xoá hẳn món đồ đó). Bản ghi item_images sẽ tự
// xoá theo do FK "on delete cascade" khi item bị xoá.
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