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


<span style="flex:1">
🏠 ${r.name}
</span>



<button
onclick="renameRoom('${r.id}')">

✏️

</button>



<button
onclick="deleteRoom('${r.id}')">

🗑

</button>


</div>
`;

    });



    list.innerHTML =
        html;


}





async function renameRoom(id) {


    const room =
        rooms.find(
            r => r.id == id
        );


    if (!room) return;



    const newName =
        prompt(
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



    const updateRoom =
        await db
            .from("rooms")
            .update({

                name:name

            })
            .eq(
                "id",
                id
            );



    if (updateRoom.error) {


        showMessage(
            "❌ " +
            updateRoom.error.message
        );


        return;

    }



    const updateItems =
        await db
            .from("items")
            .update({

                room:name

            })
            .eq(
                "room",
                room.name
            );



    if (updateItems.error) {


        showMessage(
            "❌ " +
            updateItems.error.message
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



    showMessage(
        "✅ Đã xóa phòng."
    );


}
