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
