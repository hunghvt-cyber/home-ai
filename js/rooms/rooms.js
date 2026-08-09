let rooms = [];

async function loadRooms() {

    const result =
        await db
            .from("rooms")
            .select("*")
            .order("name");

    if (result.error) {

        throw result.error;

    }

    rooms =
        result.data || [];

    updateRoomSelects();

    renderRoomManager();

}

function updateRoomSelects() {

    const room =
        document.getElementById("room");

    const roomFilter =
        document.getElementById("roomFilter");

    const batchRoomSelect =
        document.getElementById("batchRoomSelect");

    if (room) {

        room.innerHTML =
        `
<option value="">
-- Chọn phòng --
</option>
`;

        rooms.forEach(r => {

            room.innerHTML +=
            `
<option value="${escapeHtml(r.name)}">
${escapeHtml(r.name)}
</option>
`;

        });

    }

    if (batchRoomSelect) {

        batchRoomSelect.innerHTML =
        `
<option value="">
-- Chọn phòng mặc định --
</option>
`;

        rooms.forEach(r => {

            batchRoomSelect.innerHTML +=
            `
<option value="${escapeHtml(r.name)}">
${escapeHtml(r.name)}
</option>
`;

        });

    }

    if (roomFilter) {

        roomFilter.innerHTML =
        `
<option value="">
🏠 Tất cả phòng
</option>
`;

        rooms.forEach(r => {

            roomFilter.innerHTML +=
            `
<option value="${escapeHtml(r.name)}">
${escapeHtml(r.name)}
</option>
`;

        });

        roomFilter.innerHTML +=
        `
<option value="${escapeHtml(TRASH_ROOM_NAME)}">
🗑️ Thùng rác
</option>
`;

    }

}

function renderRoomManager() {

    const list =
        document.getElementById("roomList");

    if (!list) {

        return;

    }

    let html = "";

    rooms.forEach(r => {

        html +=
        `
<div class="buttonRow">

<span style="flex:1">
🏠 ${escapeHtml(r.name)}
</span>

<button
onclick="renameRoom('${escapeHtml(r.id)}')">

✏️

</button>

<button
onclick="deleteRoom('${escapeHtml(r.id)}')">

🗑

</button>

</div>
`;

    });

    list.innerHTML =
        html;

}

function openRoomManager() {

    const box =
        document.getElementById(
            "roomManager"
        );

    if (box) {

        box.style.display =
            "block";

    }

    loadRooms();

}

function closeRoomManager() {

    const box =
        document.getElementById(
            "roomManager"
        );

    if (box) {

        box.style.display =
            "none";

    }

}

async function addRoom() {

    const input =
        document.getElementById(
            "newRoom"
        );

    const name =
        input.value.trim();

    if (!name) {

        return;

    }

    if (name === TRASH_ROOM_NAME) {

        showMessage(
            "❌ Tên phòng này được dùng riêng cho Thùng rác.",
            "error"
        );

        return;

    }

    const result =
        await db
            .from("rooms")
            .insert([
                {
                    name: name
                }
            ]);

    if (result.error) {

        showMessage(
            "❌ " +
            result.error.message,
            "error"
        );

        return;

    }

    input.value = "";

    await loadRooms();

    showMessage(
        "✅ Đã thêm phòng."
    );

}

async function renameRoom(id) {

    const room =
        rooms.find(
            r => r.id == id
        );

    if (!room) {

        return;

    }

    const newName =
        await asyncPrompt(
            "Tên phòng mới:",
            room.name
        );

    if (
        !newName ||
        newName.trim() === ""
    ) {

        return;

    }

    const name =
        newName.trim();

    if (name === TRASH_ROOM_NAME) {

        showMessage(
            "❌ Tên phòng này được dùng riêng cho Thùng rác.",
            "error"
        );

        return;

    }

    const updateItems =
        await db
            .from("items")
            .update({

                room: name

            })
            .eq(
                "room",
                room.name
            );

    if (updateItems.error) {

        showMessage(
            "❌ Lỗi cập nhật đồ: " +
            updateItems.error.message,
            "error"
        );

        return;

    }

    const updateRoom =
        await db
            .from("rooms")
            .update({

                name: name

            })
            .eq(
                "id",
                id
            );

    if (updateRoom.error) {

        showMessage(
            "❌ " +
            updateRoom.error.message,
            "error"
        );

        return;

    }

    await loadRooms();

    await loadItems();

    showMessage(
        "✅ Đã đổi tên phòng."
    );

}

async function deleteRoom(id) {

    const room =
        rooms.find(
            r => r.id == id
        );

    if (!room) {

        return;

    }

    const check =
        await db
            .from("items")
            .select("id")
            .eq(
                "room",
                room.name
            );

    if (check.error) {

        showMessage(
            "❌ " +
            check.error.message,
            "error"
        );

        return;

    }

    if (
        check.data &&
        check.data.length > 0
    ) {

        showMessage(
            "❌ Không thể xóa. Phòng còn " +
            check.data.length +
            " món đồ.",
            "error"
        );

        return;

    }

    const result =
        await db
            .from("rooms")
            .delete()
            .eq(
                "id",
                id
            );

    if (result.error) {

        showMessage(
            "❌ " +
            result.error.message,
            "error"
        );

        return;

    }

    await loadRooms();

    showMessage(
        "✅ Đã xóa phòng."
    );

}
