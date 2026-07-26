let rooms = [];

async function loadRooms() {

    const result =
        await db
            .from("rooms")
            .select("*")
            .order(
                "name",
                {
                    ascending: true
                }
            );

    if (result.error) {

        showMessage(
            "❌ " +
            result.error.message
        );

        return;

    }

    rooms = result.data;

    renderRooms();

}

function renderRooms() {

    const select =
        document.getElementById(
            "room"
        );

    const list =
        document.getElementById(
            "roomList"
        );

    if (select) {

        let html = "";

        rooms.forEach(room => {

            html += `
<option value="${room.name}">
${room.name}
</option>
`;

        });

        select.innerHTML = html;

    }

    if (list) {

        let html = "";

        rooms.forEach(room => {

            html += `

<div class="buttonRow">

<span style="flex:1;">
${room.name}
</span>

<button
onclick="renameRoom('${room.id}')">
✏️
</button>

<button
onclick="deleteRoom('${room.id}')">
🗑️
</button>

</div>

`;

        });

        list.innerHTML = html;

    }

}

function openRoomManager() {

    document
        .getElementById(
            "roomManager"
        )
        .style.display =
        "block";

    loadRooms();

}

function closeRoomManager() {

    document
        .getElementById(
            "roomManager"
        )
        .style.display =
        "none";

}

async function addRoom() {

    const input =
        document.getElementById(
            "newRoom"
        );

    const name =
        input.value.trim();

    if (name === "") {

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
            result.error.message
        );

        return;

    }

    input.value = "";

    await loadRooms();

}

async function renameRoom(id) {

    const room =
        rooms.find(
            x => x.id === id
        );

    if (!room) {

        return;

    }

    const name =
        prompt(
            "Tên mới:",
            room.name
        );

    if (
        !name ||
        name.trim() === ""
    ) {

        return;

    }

    const result =
        await db
            .from("rooms")
            .update({
                name: name.trim()
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

    await loadRooms();

}

async function deleteRoom(id) {

    if (
        !confirm(
            "Xóa phòng?"
        )
    ) {

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
            result.error.message
        );

        return;

    }

    await loadRooms();

}