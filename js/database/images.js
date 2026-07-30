// Tải danh sách ảnh phụ của 1 món đồ
async function loadItemImages(itemId) {

    const result =
        await db
            .from("item_images")
            .select("*")
            .eq("item_id", itemId)
            .order(
                "sort_order",
                {
                    ascending: true
                }
            );

    if (result.error) {

        console.warn(
            "Không tải được ảnh phụ:",
            result.error
        );

        return [];

    }

    return result.data || [];

}


// Lưu 1 ảnh phụ
async function insertItemImage(
    itemId,
    imageUrl,
    sortOrder
) {

    const result =
        await db
            .from("item_images")
            .insert([

                {
                    item_id: itemId,
                    image_url: imageUrl,
                    sort_order: sortOrder
                }

            ]);

    if (result.error) {

        throw result.error;

    }

}


// Xóa toàn bộ bản ghi ảnh phụ
async function deleteItemImages(itemId) {

    const result =
        await db
            .from("item_images")
            .delete()
            .eq(
                "item_id",
                itemId
            );

    if (result.error) {

        throw result.error;

    }

}