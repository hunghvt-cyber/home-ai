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



        if (item.image_url) {

            try {

                const url =
                    new URL(
                        item.image_url
                    );



                const parts =
                    url.pathname.split(
                        "/"
                    );



                const bucketIndex =
                    parts.indexOf(
                        "images"
                    );



                if (
                    bucketIndex >= 0
                ) {

                    const filePath =
                        parts
                            .slice(
                                bucketIndex + 1
                            )
                            .join("/");



                    await db.storage
                        .from("images")
                        .remove([
                            decodeURIComponent(
                                filePath
                            )
                        ]);

                }

            }
            catch (e) {

                console.warn(
                    "Không xóa được ảnh:",
                    e
                );

            }

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