// js/database/delete.js
// Xoá 1 món = chuyển vào phòng "Thùng rác" (xoá mềm),
// không xoá thật dữ liệu/ảnh. Xoá vĩnh viễn nằm ở trash.js

const TRASH_ROOM_NAME =
    "Thùng rác";



async function deleteItem(id) {

    const ok =
        confirm(
            "Chuyển món này vào Thùng rác?"
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

        const result =
            await db
                .from("items")
                .update({

                    previous_room:
                        item.room || "",

                    room:
                        TRASH_ROOM_NAME,

                    trashed_at:
                        new Date().toISOString()

                })
                .eq(
                    "id",
                    id
                );

        if (result.error) {

            throw result.error;

        }

        await loadItems();

        showMessage(
            "🗑 Đã chuyển vào Thùng rác."
        );

    }
    catch (error) {

        showMessage(
            "❌ " +
            error.message
        );

    }

}
