// js/ai/multi-scan.js

let currentBatchItems = [];

function openMultiScanCamera() {

    const input =
        document.getElementById(
            "multiScanInput"
        );

    if (input) {

        input.click();

    }

}

function initMultiScan() {

    const input =
        document.getElementById(
            "multiScanInput"
        );

    if (input) {

        input.addEventListener(
            "change",
            handleMultiScanImage
        );

    }

}

async function handleMultiScanImage(event) {

    const file =
        event.target.files[0];

    event.target.value = "";

    if (!file) {

        return;

    }

    showMessage(
        "🤖 AI đang phân tích ảnh Multi-Scan..."
    );

    try {

        const base64 =
            await fileToBase64(file);

        const cleanBase64 =
            base64.split(",")[1];

        const response =
            await fetch(

                "https://home-ai-two-topaz.vercel.app/api/gemini",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        imageBase64:
                            cleanBase64,

                        mimeType:
                            file.type,

                        mode:
                            "multi"

                    })

                }

            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Lỗi khi gọi AI Multi-Scan"
            );

        }

        const items =
            data.items || [];

        if (items.length === 0) {

            showMessage(
                "⚠️ AI không nhận diện được món đồ nào trong ảnh."
            );

            return;

        }

        const previewUrl =
            URL.createObjectURL(file);

        currentBatchItems =
            items.map(item => ({

                file: file,

                previewUrl: previewUrl,

                name: item.name || "",

                tags: item.tags || [],

                description: item.description || "",

                selected: true

            }));

        renderBatchModal();

        showMessage(
            `📸 AI đã tách được ${items.length} món đồ từ ảnh!`
        );

    }
    catch (error) {

        showMessage(
            "❌ Lỗi Multi-Scan: " +
            error.message,

            "error"
        );

    }

}

function renderBatchModal() {

    const modal =
        document.getElementById(
            "batchModal"
        );

    const container =
        document.getElementById(
            "batchItemsList"
        );

    if (!modal || !container) {

        return;

    }

    let html = "";

    currentBatchItems.forEach((item, index) => {

        const tagsStr =
            Array.isArray(item.tags)
                ? item.tags.join(", ")
                : "";

        html += `
<div class="batchItemCard">

<input
type="checkbox"
id="batch_chk_${index}"
${item.selected ? "checked" : ""}
onchange="toggleBatchItem(${index}, this.checked)">

<img src="${item.previewUrl}">

<div class="batchItemInfo">

<input
type="text"
id="batch_name_${index}"
value="${escapeHtml(item.name)}"
placeholder="Tên món đồ"
oninput="updateBatchItemName(${index}, this.value)">

<input
type="text"
id="batch_tags_${index}"
value="${escapeHtml(tagsStr)}"
placeholder="Tags (cách nhau bởi dấu phẩy)"
oninput="updateBatchItemTags(${index}, this.value)">

<input
type="text"
id="batch_desc_${index}"
value="${escapeHtml(item.description)}"
placeholder="Mô tả"
oninput="updateBatchItemDesc(${index}, this.value)">

</div>

</div>
`;

    });

    container.innerHTML =
        html;

    modal.style.display =
        "flex";

}

function toggleBatchItem(index, checked) {

    if (currentBatchItems[index]) {

        currentBatchItems[index].selected =
            checked;

    }

}

function updateBatchItemName(index, val) {

    if (currentBatchItems[index]) {

        currentBatchItems[index].name =
            val;

    }

}

function updateBatchItemTags(index, val) {

    if (currentBatchItems[index]) {

        currentBatchItems[index].tags =
            val.split(",")
                .map(t => t.trim())
                .filter(Boolean);

    }

}

function updateBatchItemDesc(index, val) {

    if (currentBatchItems[index]) {

        currentBatchItems[index].description =
            val;

    }

}

function closeBatchModal() {

    const modal =
        document.getElementById(
            "batchModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

    currentBatchItems.forEach(item => {

        if (
            item.previewUrl &&
            item.previewUrl.startsWith("blob:")
        ) {

            URL.revokeObjectURL(
                item.previewUrl
            );

        }

    });

    currentBatchItems = [];

}

async function saveBatchItems() {

    const roomSelect =
        document.getElementById(
            "batchRoomSelect"
        );

    const locationInput =
        document.getElementById(
            "batchLocationInput"
        );

    const defaultRoom =
        roomSelect ? roomSelect.value : "";

    const defaultLocation =
        locationInput ? locationInput.value.trim() : "";

    const selectedItems =
        currentBatchItems.filter(
            item =>
                item.selected &&
                item.name.trim() !== ""
        );

    if (selectedItems.length === 0) {

        showMessage(
            "❌ Vui lòng chọn ít nhất 1 món có tên để lưu."
        );

        return;

    }

    showMessage(
        `⏳ Đang lưu ${selectedItems.length} món...`
    );

    try {

        for (const item of selectedItems) {

            let imageUrl = "";

            if (item.file) {

                imageUrl =
                    await uploadImage(
                        item.file
                    );

            }

            await insertItem({

                name:
                    item.name.trim(),

                room:
                    defaultRoom,

                location:
                    defaultLocation,

                tags:
                    item.tags,

                description:
                    item.description,

                image_url:
                    imageUrl

            });

        }

        closeBatchModal();

        if (typeof loadItems === "function") {

            await loadItems();

        }

        showMessage(
            `✅ Đã lưu thành công ${selectedItems.length} món vào ${defaultRoom || "danh sách"}!`
        );

    }
    catch (error) {

        showMessage(
            "❌ Lỗi khi lưu danh sách: " +
            error.message,

            "error"
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    initMultiScan
);
