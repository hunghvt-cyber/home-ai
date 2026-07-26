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
<option value="${r.name}">
${r.name}
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
<option value="${r.name}">
${r.name}
</option>
`;

        });

    }

}



function renderRoomManager() {


    const list =
        document.getElementById("roomList");


    if (!list) return;


    let html = "";


    rooms.forEach(r => {

        html +=
        `
<div class="buttonRow">

<span>
🏠 ${r.name}
</span>

<button onclick="deleteRoom('${r.id}')">
🗑
</button>

</div>
`;

    });


    list.innerHTML = html;

}



async function deleteRoom(id) {


    const room =
        rooms.find(
            r => r.id == id
        );


    if (!room) return;



    const check =
        await db
            .from("items")
            .select("id")
            .eq(
                "room",
                room.name
            );



    if (
        check.data &&
        check.data.length > 0
    ) {

        showMessage(
            "❌ Không thể xóa. Phòng còn " +
            check.data.length +
            " món đồ."
        );

        return;

    }



    await db
        .from("rooms")
        .delete()
        .eq(
            "id",
            id
        );



    await loadRooms();


    showMessage(
        "✅ Đã xóa phòng."
    );

}
