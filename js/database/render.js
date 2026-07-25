let allItems = [];

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }

    const date = new Date(dateString);

    let hours = date.getHours();

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
        hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {

        hours = 12;

    }

    hours =
        String(hours)
        .padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;

}

function renderItems(items = allItems) {

    const list =
        document.getElementById("list");

    let html = "";

    items.forEach(item => {

        html += `

<div class="card">

<img
src="${item.image_url}"
loading="lazy">

<h3>📦 ${item.name}</h3>

<p>📍 ${item.location || "-"}</p>

<p>🕒 ${formatDate(item.created_at)}</p>

</div>

`;

    });

    list.innerHTML = html;

}