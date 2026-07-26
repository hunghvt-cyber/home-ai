function getRoomStats() {


    const stats = {};


    if (!allItems || allItems.length === 0) {

        return stats;

    }



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



    if (html === "") {


        html =

        `
<p>
Chưa có dữ liệu thống kê.
</p>
`;

    }



    box.innerHTML =
        html;


}
