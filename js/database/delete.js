async function deleteItem(id) {

    const ok =
        confirm(
            "Xóa món đồ này?"
        );

    if (!ok) {

        return;

    }

    try {

        const item =
            allItems.find(
                x => x.id == id
            );

        if (!item) {

            throw new Error(
                "Không tìm thấy dữ liệu."
            );

        }

        // Xóa ảnh đại diện
        if (item.image_url) {

            await deleteStorageImage(
                item.image_url
            );

        }

        // Xóa toàn bộ ảnh phụ
        await deleteAllItemImagesStorage(
            id
        );

        // Xóa dữ liệu
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

        await loadItems();

        showMessage(
            "🗑 Đã xóa."
        );

    }
    catch (error) {

        showMessage(
            "❌ " +
            error.message
        );

    }

}