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





function renderTags(tags) {

    if (
        !tags ||
        !Array.isArray(tags) ||
        tags.length === 0
    ) {

        return "";

    }

    return tags
        .map(
            tag =>
                `<span class="tag">${tag}</span>`
        )
        .join("");

}





function renderItems(items = allItems) {

    const list =
        document.getElementById(
            "list"
        );

    if (!list) {

        return;

    }

    let html = "";

    items.forEach(item => {

        const tags =
            renderTags(
                item.tags
            );

        html += `

<div class="card">

<div class="cardImage">

<img
src="${item.image_url}"
loading="lazy"
onclick="window.open('${item.image_url}','_blank')">

</div>

<div class="cardBody">

<h3>

📦 ${item.name}

</h3>

<p class="description">

${item.description || ""}

</p>

<p class="meta">

🏠
<span
class="roomBadge"
onclick="filterByRoom('${item.room}')">

${item.room || "Chưa có phòng"}

</span>

&nbsp;&nbsp;

📍 ${item.location || "-"}

</p>

<div>

${tags}

</div>

<p class="date">

🕒 ${formatDate(item.created_at)}

</p>

<div class="buttonRow">

<button
onclick="editItem('${item.id}')">

✏️

</button>

<button
onclick="deleteItem('${item.id}')">

🗑

</button>

</div>

</div>

</div>

`;

    });

    list.innerHTML =
        html;

}