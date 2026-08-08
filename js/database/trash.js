// js/database/trash.js
// Khôi phục / Xoá vĩnh viễn / Làm sạch / Tự động dọn Thùng rác


// Xoá vĩnh viễn 1 món (ảnh đại diện + ảnh phụ + bản ghi item)
async function permanentlyDeleteItem(id) {

    const ok =
        confirm(
            "Xoá vĩnh viễn món này? Không thể khôi phục."
        );

    if (!ok) {

        return;

    }

    try {

        await hardDeleteById(id);

        await loadItems();

        showMessage(
            "🗑 Đã xoá vĩnh viễn."
        );

    }
    catch (error) {

        showMessage(
            "❌ " +
            error.message
        );

    }

}


// Hàm dùng chung: xoá thật ảnh Storage + item_images + bản ghi items
async function hardDeleteById(id) {

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

        await deleteStorageImage(
            item.image_url
        );

    }

    await deleteAllItemImagesStorage(
        id
    );

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

}


// Khôi phục 1 món về đúng phòng cũ trước khi bị xoá
async function restoreItem(id) {

    const item =
        allItems.find(
            x => x.id == id
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
            .update({

                room:
                    item.previous_room || "",

                trashed_at: null,

                previous_room: null

            })
            .eq(
                "id",
                id
            );

    if (result.error) {

        showMessage(
            "❌ " +
            result.error.message
        );

        return;

    }

    await loadItems();

    showMessage(
        "♻️ Đã khôi phục."
    );

}


// Xoá vĩnh viễn TOÀN BỘ món trong Thùng rác
async function emptyTrash() {

    const trashedItems =
        allItems.filter(
            item =>
                item.room === TRASH_ROOM_NAME
        );

    if (trashedItems.length === 0) {

        showMessage(
            "🧹 Thùng rác đang trống."
        );

        return;

    }

    const ok =
        confirm(
            "Xoá vĩnh viễn toàn bộ " +
            trashedItems.length +
            " món trong Thùng rác?"
        );

    if (!ok) {

        return;

    }

    for (const item of trashedItems) {

        try {

            await hardDeleteById(
                item.id
            );

        }
        catch (error) {

            console.warn(
                error
            );

        }

    }

    await loadItems();

    showMessage(
        "🧹 Đã làm sạch Thùng rác."
    );

}


// Tự động dọn các món đã nằm trong Thùng rác quá 30 ngày.
// Gọi mỗi khi mở app / tải danh sách (không có cron thật vì đây là site tĩnh).
async function runTrashAutoClean() {

    const cutoff =
        new Date();

    cutoff.setDate(
        cutoff.getDate() - 30
    );

    const result =
        await db
            .from("items")
            .select("id")
            .eq(
                "room",
                TRASH_ROOM_NAME
            )
            .lt(
                "trashed_at",
                cutoff.toISOString()
            );

    if (result.error) {

        console.warn(
            result.error
        );

        return;

    }

    const oldItems =
        result.data || [];

    for (const row of oldItems) {

        try {

            const detail =
                await db
                    .from("items")
                    .select("*")
                    .eq(
                        "id",
                        row.id
                    )
                    .single();

            if (
                detail.data &&
                detail.data.image_url
            ) {

                await deleteStorageImage(
                    detail.data.image_url
                );

            }

            await deleteAllItemImagesStorage(
                row.id
            );

            await db
                .from("items")
                .delete()
                .eq(
                    "id",
                    row.id
                );

        }
        catch (error) {

            console.warn(
                error
            );

        }

    }

}


// Hiện/ẩn nút "Làm sạch thùng rác" tuỳ theo đang lọc phòng nào
function updateEmptyTrashButtonVisibility() {

    const emptyBtn =
        document.getElementById(
            "emptyTrashButton"
        );

    const roomFilter =
        document.getElementById(
            "roomFilter"
        );

    if (
        emptyBtn &&
        roomFilter
    ) {

        emptyBtn.style.display =
            roomFilter.value === TRASH_ROOM_NAME
                ? "inline-block"
                : "none";

    }

}
