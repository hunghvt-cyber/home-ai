// js/database/save-item.js

async function insertItem(data) {

    const result =

        await db

            .from("items")

            .insert([
                data
            ])

            .select();

    if (result.error) {

        throw result.error;

    }

    const item =
        result.data[0];

    if (
        pendingExtraImages.length >
        0
    ) {

        await uploadExtraImages(

            item.id,

            pendingExtraImages,

            0

        );

    }

    return item;

}



async function updateItem(data) {

    let imageUrl =
        editingItem.image_url;

    const oldImageUrl =
        editingItem.image_url;



    if (selectedFile) {

        imageUrl =
            await uploadImage(
                selectedFile
            );

    }



    const result =

        await db

            .from("items")

            .update({

                ...data,

                image_url:
                    imageUrl

            })

            .eq(
                "id",
                editingItem.id
            );



    if (result.error) {

        throw result.error;

    }



    if (
        selectedFile &&
        oldImageUrl
    ) {

        await deleteStorageImage(
            oldImageUrl
        );

    }



    if (
        pendingExtraImages.length >
        0
    ) {

        await uploadExtraImages(

            editingItem.id,

            pendingExtraImages,

            existingExtraImagesCount

        );

    }

}