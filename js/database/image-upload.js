// js/database/image-upload.js

async function uploadImage(file) {

    const resizedBlob =
        await resizeImage(
            file
        );

    const randomSuffix =
        Math.random()
            .toString(36)
            .slice(2, 8);

    const extension =
        ".webp";

    const fileName =

        Date.now() +

        "_" +

        randomSuffix +

        "_" +

        file.name
            .replace(/\s/g, "_")
            .replace(/\.[^/.]+$/, "") +

        extension;



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



async function uploadExtraImages(
    itemId,
    files,
    startOrder = 0
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