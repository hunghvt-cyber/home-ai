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

        throw result.error;

    }


    rooms =
        result.data || [];


    updateRoomSelects();

    renderRoomManager();

}



function updateRoomSelects() {


    const room =
        document.getElementById(
            "room"
        );


    const roomFilter =
        document.getElementById(
            "roomFilter"
        );



    if (room) {


        let html =
            `
<option value="">
-- Chọn phòng --
</option>
`;


        rooms.forEach(item => {


            html +=
            `
<option value="${item.name}">
${item.name}
</option>
`;


        });


        room.innerHTML =
            html;


    }




    if (roomFilter) {


        let html =
            `
<option value="">
🏠 Tất cả phòng
</option>
`;


        rooms.forEach(item => {


            html +=
            `
<option value="${item.name}">
${item.name}
</option>
`;


        });


        roomFilter.innerHTML =
            html;


    }


}



function renderRoomManager() {


    const list =
        document.getElementById(
            "roomList"
        );


    if (!list) {

        return;

    }


    let html = "";


    rooms.forEach(room => {


        html +=
        `

<div class="buttonRow">

<span style="flex:1">
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


    list.innerHTML =
        html;


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
                    name:name
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



    showMessage(
        "✅ Đã thêm phòng."
    );


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
            "Tên phòng mới:",
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

                name:
                    name.trim()

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


    showMessage(
        "✅ Đã đổi tên phòng."
    );


}





async function deleteRoom(id) {


    const room =
        rooms.find(
            x => x.id === id
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
            )
            .limit(1);



    if (check.error) {


        showMessage(
            "❌ " +
            check.error.message
        );


        return;


    }



    if (
        check.data &&
        check.data.length > 0
    ) {


        showMessage(
            "❌ Phòng này đang có đồ, không thể xóa."
        );


        return;


    }




    if (
        !confirm(
            "Xóa phòng này?"
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



    showMessage(
        "✅ Đã xóa phòng."
    );


}
