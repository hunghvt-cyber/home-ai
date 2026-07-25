async function deleteItem(id) {

    if (
        !confirm(
            "Bạn có chắc muốn xóa?"
        )
    ) {

        return;

    }

    try {

        const item =
            allItems.find(
                x => x.id === id
            );


        if (!item) {

            showMessage(
                "❌ Không tìm thấy dữ liệu."
            );

            return;

        }


        const result =
            await db
                .from("items")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (result.error) {

            throw result.error;

        }


        if (
            item.image_url
        ) {

            const fileName =
                item.image_url
                    .split("/")
                    .pop();


            if (fileName) {

                const remove =
                    await db.storage
                        .from("images")
                        .remove([
                            fileName
                        ]);


                if (remove.error) {

                    console.log(
                        remove.error
                    );

                }

            }

        }


        showMessage(
            "✅ Đã xóa thành công."
        );


        await loadItems();


    }
    catch(error) {

        showMessage(
            "❌ " + error.message
        );

    }

}
