function getRoomStats() {


    const stats = {};


    allItems.forEach(item => {


        const room =
            item.room || "Chưa có phòng";


        if (!stats[room]) {

            stats[room] = 0;

        }


        stats[room]++;


    });


    return stats;


}



function renderRoomStats() {


    const box =
        document.getElementById(
            "roomStats"
        );


    if (!box) {

        return;

    }



    const stats =
        getRoomStats();



    let html = "";



    Object.keys(stats)
        .forEach(room => {


            html += `

<div
class="buttonRow"
onclick="filterByRoom('${room}')"
style="cursor:pointer">

<span>
🏠 ${room}
</span>

<span>
${stats[room]} món
</span>

</div>

`;


        });



    box.innerHTML =
        html;


}
