let allItems = [];



function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


    let hours =
        date.getHours();


    const minutes =
        String(date.getMinutes())
        .padStart(2, "0");


    const day =
        String(date.getDate())
        .padStart(2, "0");


    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");


    const year =
        date.getFullYear();


    const ampm =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


    if (hours === 0) {

        hours = 12;

    }


    hours =
        String(hours)
        .padStart(2, "0");


    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;

}





function filterByRoom(roomName) {


    const items =
        allItems.filter(item => {

            return item.room === roomName;

        });


    renderItems(items);



    const search =
        document.getElementById(
            "search"
        );


    if (search) {

        search.value = "";

    }

}





function renderTags(tags) {


    if (!tags) {

        return "";

    }



    let list = [];



    try {

        list =
            Array.isArray(tags)
                ? tags
                : JSON.parse(tags);


    }
    catch {

        list =
            String(tags)
            .split(",");

    }



    if (
        !list ||
        list.length === 0
    ) {

        return "";

    }



    return list
        .filter(
            tag =>
            tag &&
            tag.trim() !== ""
        )
        .map(
            tag =>
            `
<span class="tag">
${tag.trim()}
</span>
`
        )
        .join("");

}





function renderItems(items = allItems) {


    const list =
        document.getElementById(
            "list"
        );


    let html = "";



    items.forEach(item => {



        const roomBadge =
            item.room
                ?
                `
<span
onclick="filterByRoom('${item.room}')"
style="
cursor:pointer;
background:#e3f2fd;
padding:4px 8px;
border-radius:12px;
">

🏠 ${item.room}

</span>
`
                :
                "🏠 Chưa có phòng";



        const tags =
            renderTags(
                item.tags
            );



        html += `

<div class="card">


<img
src="${item.image_url}"
loading="lazy">


<h3>
📦 ${item.name}
</h3>



<p>
${roomBadge}
</p>



<p>
${tags}
</p>



<p>
📍 ${item.location || "-"}
</p>



<p>
🕒 ${formatDate(item.created_at)}
</p>



<div class="buttonRow">


<button
onclick="editItem('${item.id}')">

✏️ Sửa

</button>



<button
onclick="deleteItem('${item.id}')">

🗑 Xóa

</button>


</div>


</div>

`;

    });



    list.innerHTML =
        html;

}