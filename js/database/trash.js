// js/database/trash.js
// Khôi phục / Xoá vĩnh viễn / Làm sạch / Tự động dọn Thùng rác & File rác Storage


// Xoá vĩnh viễn 1 món (ảnh đại diện + ảnh phụ + bản ghi item)
async function permanentlyDeleteItem(id) {

    const ok =
        await asyncConfirm(
            "Xóa vĩnh viễn",
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
            error.message,
            "error"
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


// Quét và xóa toàn bộ file ảnh tồn đọng trên Storage không còn liên kết với món đồ nào
async function cleanOrphanedStorageFiles() {

    try {

        // 1. Lấy toàn bộ URL ảnh đang sử dụng trong bảng items và item_images
        const { data: mainItems } =
            await db
                .from("items")
                .select("image_url");

        const { data: extraItems } =
            await db
                .from("item_images")
                .select("image_url");

        const activePaths = new Set();

        (mainItems || []).forEach(item => {

            const path = extractStoragePath(item.image_url);

            if (path) {

                activePaths.add(path);

            }

        });

        (extraItems || []).forEach(item => {

            const path = extractStoragePath(item.image_url);

            if (path) {

                activePaths.add(path);

            }

        });

        // 2. Lấy danh sách file đang có trong bucket 'images' trên Storage
        const storageList =
            await db.storage
                .from("images")
                .list("", { limit: 1000 });

        if (storageList.error || !storageList.data) {

            console.warn(
                "⚠️ Không lấy được danh sách file Storage:",
                storageList.error
            );

            return 0;

        }

        // 3. Lọc ra các file mồ côi (có trên Storage nhưng không có trong DB)
        const orphanedPaths =
            storageList.data
                .map(file => file.name)
                .filter(fileName => !activePaths.has(fileName));

        if (orphanedPaths.length === 0) {

            return 0;

        }

        // 4. Tiến hành xóa các file rác khỏi Storage
        const deleteResult =
            await db.storage
                .from("images")
                .remove(orphanedPaths);

        if (deleteResult.error) {

            console.warn(
                "⚠️ Lỗi khi dọn file rác Storage:",
                deleteResult.error
            );

            return 0;

        }

        console.log(
            `🧹 [Storage Clean]: Đã dọn ${orphanedPaths.length} file rác mồ côi:`,
            orphanedPaths
        );

        return orphanedPaths.length;

    }
    catch (error) {

        console.warn(
            "⚠️ Ngoại lệ khi quét file rác Storage:",
            error
        );

        return 0;

    }

}


// Xoá vĩnh viễn TOÀN BỘ món trong Thùng rác + Dọn sạch file rác đọng trên Storage
async function emptyTrash() {

    const trashedItems =
        allItems.filter(
            item =>
                item.room === TRASH_ROOM_NAME
        );

    const ok =
        await asyncConfirm(
            "Làm sạch Thùng rác",
            "Xoá vĩnh viễn toàn bộ món trong Thùng rác và quét dọn toàn bộ ảnh rác tồn đọng trên Storage?"
        );

    if (!ok) {

        return;

    }

    let deletedCount = 0;

    // 1. Xóa toàn bộ các món nằm trong Thùng rác
    for (const item of trashedItems) {

        try {

            await hardDeleteById(
                item.id
            );

            deletedCount++;

        }
        catch (error) {

            console.warn(
                error
            );

        }

    }

    // 2. Quét dọn các file ảnh rác tồn đọng trên Storage
    const cleanedFilesCount =
        await cleanOrphanedStorageFiles();

    await loadItems();

    let msg = "🧹 Đã làm sạch Thùng rác.";

    if (deletedCount > 0 || cleanedFilesCount > 0) {

        msg += `\n- Đã xóa ${deletedCount} món đồ.\n- Đã dọn ${cleanedFilesCount} file rác đọng trên Storage.`;

    }

    showMessage(msg);

}


// Tự động dọn các món đã nằm trong Thùng rác quá 30 ngày.
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

    if (oldItems.length === 0) {

        return;

    }

    const ids = oldItems.map(row => row.id);

    const detailsResult =
        await db
            .from("items")
            .select("*")
            .in("id", ids);

    if (detailsResult.error) {

        console.warn(
            detailsResult.error
        );

        return;

    }

    const itemsToDelete = detailsResult.data || [];

    for (const item of itemsToDelete) {

        try {

            if (item.image_url) {

                await deleteStorageImage(
                    item.image_url
                );

            }

            await deleteAllItemImagesStorage(
                item.id
            );

            await db
                .from("items")
                .delete()
                .eq(
                    "id",
                    item.id
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
