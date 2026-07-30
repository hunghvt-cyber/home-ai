// js/database/save-upload.js -> Upload ảnh

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