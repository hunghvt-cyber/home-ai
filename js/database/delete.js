async function deleteItem(id) {

    const confirmDelete =
        confirm(
            "Bạn có chắc muốn xóa món đồ này?"
        );

    if (!confirmDelete) {

        return;

    }

    try {

        const item =
            allItems.find(
                x => x.id === id
            );

        if (!item) {

            return;

        }

        const fileName =
            item.image_url
                .split("/images/")
                .pop();

        if (fileName) {

            await db.storage
                .from("images")
                .remove([
                    fileName
                ]);

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

        showMessage(
            "✅ Đã xóa."
        );

        await loadItems();

    }
    catch(error) {

        showMessage(
            "❌ " + error.message
        );

    }

}
