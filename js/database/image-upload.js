// Upload 1 ảnh lên Supabase Storage
async function uploadImage(file) {

    const resizedBlob =
        await resizeImage(
            file
        );

    const randomSuffix =
        Math.random()
            .toString(36)
            .slice(2, 8);

    const fileName =
        Date.now() +
        "_" +
        randomSuffix +
        "_" +
        file.name
            .replace(/\s/g, "_")
            .replace(/\.[^/.]+$/, "") +
        ".webp";

    const upload =
        await db.storage
            .from("images")
            .upload(
                fileName,
                resizedBlob,
                {
                    contentType:
                        "image/webp"
                }
            );

    if (upload.error) {

        throw upload.error;

    }

    return db.storage
        .from("images")
        .getPublicUrl(
            fileName
        )
        .data
        .publicUrl;

}


// Upload nhiều ảnh phụ
async function uploadExtraImages(
    itemId,
    files,
    startOrder = 0
) {

    if (
        !files ||
        files.length === 0
    ) {

        return;

    }

    const uploads =
        await Promise.all(

            files.map(
                uploadImage
            )

        );

    const rows =
        uploads.map(

            function(
                imageUrl,
                index
            ) {

                return {

                    item_id:
                        itemId,

                    image_url:
                        imageUrl,

                    sort_order:
                        startOrder +
                        index

                };

            }

        );

    const result =
        await db
            .from(
                "item_images"
            )
            .insert(
                rows
            );

    if (result.error) {

        throw result.error;

    }

}
