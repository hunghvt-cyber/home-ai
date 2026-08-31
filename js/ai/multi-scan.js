// js/ai/multi-scan.js

let currentBatchItems = [];


// ============================================================
// MULTI-SCAN CAMERA
// ============================================================

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


// ============================================================
// MULTI-SCAN ANALYSIS
// ============================================================

async function handleMultiScanImage(
    event
) {

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


        const data =
            await callGeminiAPI({

                imageBase64:
                    cleanBase64,

                mimeType:
                    file.type,

                mode:
                    "multi"

            });


        const items =
            data.items || [];


        if (
            items.length === 0
        ) {

            showMessage(
                "⚠️ AI không nhận diện được món đồ nào trong ảnh."
            );

            return;

        }


        const previewUrl =
            URL.createObjectURL(file);


        currentBatchItems =
            items.map(
                item => ({

                    file:
                        file,

                    previewUrl:
                        previewUrl,

                    name:
                        item.name || "",

                    tags:
                        Array.isArray(
                            item.tags
                        )
                            ? item.tags
                            : [],

                    description:
                        item.description ||
                        "",

                    selected:
                        true

                })
            );


        renderBatchModal();


        showMessage(
            `📸 AI đã tách được ${items.length} món đồ từ ảnh!`
        );

    }
    catch (error) {

        console.error(
            "Multi-Scan error:",
            error
        );


        showMessage(
            "❌ Lỗi Multi-Scan: " +
            error.message,
            "error"
        );

    }

}


// ============================================================
// BATCH MODAL
// ============================================================

function renderBatchModal() {

    const modal =
        document.getElementById(
            "batchModal"
        );

    const container =
        document.getElementById(
            "batchItemsList"
        );


    if (
        !modal ||
        !container
    ) {

        return;

    }


    let html = "";


    currentBatchItems.forEach(
        (item, index) => {

            const tagsStr =
                Array.isArray(
                    item.tags
                )
                    ? item.tags.join(
                        ", "
                    )
                    : "";


            html += `

<div class="batchItemCard">

    <div class="batchCheckBox">

        <input
            type="checkbox"
            id="batch_chk_${index}"
            ${
                item.selected
                    ? "checked"
                    : ""
            }
            onchange="toggleBatchItem(
                ${index},
                this.checked
            )">

    </div>


    <img
        class="batchItemImage"
        src="${escapeHtml(
            item.previewUrl
        )}"
        alt="${escapeHtml(
            item.name ||
            `Món ${index + 1}`
        )}">


    <div class="batchItemInfo">

        <div class="batchItemNumber">
            Món ${index + 1}
        </div>


        <label
            for="batch_name_${index}">
            Tên
        </label>

        <input
            type="text"
            id="batch_name_${index}"
            value="${escapeHtml(
                item.name
            )}"
            placeholder="Tên món đồ"
            oninput="
                updateBatchItemName(
                    ${index},
                    this.value
                )
            ">


        <label
            for="batch_tags_${index}">
            Tags
        </label>

        <input
            type="text"
            id="batch_tags_${index}"
            value="${escapeHtml(
                tagsStr
            )}"
            placeholder="Ví dụ: gia dụng, AQUA"
            oninput="
                updateBatchItemTags(
                    ${index},
                    this.value
                )
            ">


        <label
            for="batch_desc_${index}">
            Mô tả
        </label>

        <textarea
            id="batch_desc_${index}"
            placeholder="Mô tả món đồ"
            oninput="
                updateBatchItemDesc(
                    ${index},
                    this.value
                )
            ">${escapeHtml(
                item.description
            )}</textarea>

    </div>

</div>

`;

        }
    );


    container.innerHTML =
        html;


    modal.style.display =
        "flex";

}


// ============================================================
// BATCH ITEM STATE
// ============================================================

function toggleBatchItem(
    index,
    checked
) {

    if (
        currentBatchItems[index]
    ) {

        currentBatchItems[index]
            .selected =
            checked;

    }

}


function updateBatchItemName(
    index,
    value
) {

    if (
        currentBatchItems[index]
    ) {

        currentBatchItems[index]
            .name =
            value;

    }

}


function updateBatchItemTags(
    index,
    value
) {

    if (
        currentBatchItems[index]
    ) {

        currentBatchItems[index]
            .tags =
            value
                .split(",")
                .map(
                    tag =>
                        tag.trim()
                )
                .filter(
                    Boolean
                );

    }

}


function updateBatchItemDesc(
    index,
    value
) {

    if (
        currentBatchItems[index]
    ) {

        currentBatchItems[index]
            .description =
            value;

    }

}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeBatchModal() {

    const modal =
        document.getElementById(
            "batchModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    currentBatchItems.forEach(
        item => {

            if (
                item.previewUrl &&
                item.previewUrl
                    .startsWith(
                        "blob:"
                    )
            ) {

                URL.revokeObjectURL(
                    item.previewUrl
                );

            }

        }
    );


    currentBatchItems = [];

}


// ============================================================
// UPLOAD CACHE
// ============================================================

async function getBatchImageUrl(
    item,
    imageCache
) {

    if (!item.file) {

        return "";

    }


    // File object làm key.
    // Multi-Scan: tất cả item có cùng File.
    // Burst: mỗi item có File riêng.
    if (
        imageCache.has(
            item.file
        )
    ) {

        return imageCache.get(
            item.file
        );

    }


    const imageUrl =
        await uploadImage(
            item.file
        );


    imageCache.set(
        item.file,
        imageUrl
    );


    return imageUrl;

}


// ============================================================
// SAVE BATCH
// ============================================================

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
        roomSelect
            ? roomSelect.value
            : "";


    const defaultLocation =
        locationInput
            ? locationInput.value.trim()
            : "";


    const selectedItems =
        currentBatchItems.filter(
            item =>
                item.selected &&
                String(
                    item.name || ""
                ).trim() !== ""
        );


    if (
        selectedItems.length === 0
    ) {

        showMessage(
            "❌ Vui lòng chọn ít nhất 1 món có tên để lưu."
        );

        return;

    }


    showMessage(
        `⏳ Đang lưu ${selectedItems.length} món...`
    );


    try {

        /*
         * Image cache rất quan trọng:
         *
         * Multi-Scan:
         *   item 1 -> file A
         *   item 2 -> file A
         *   item 3 -> file A
         *
         *   => upload A đúng 1 lần.
         *
         * Burst:
         *   item 1 -> file A
         *   item 2 -> file B
         *   item 3 -> file C
         *
         *   => upload A, B, C riêng.
         */

        const imageCache =
            new Map();


        let savedCount = 0;


        for (
            const item of selectedItems
        ) {

            const imageUrl =
                await getBatchImageUrl(
                    item,
                    imageCache
                );


            await insertItem({

                name:
                    String(
                        item.name || ""
                    ).trim(),

                room:
                    defaultRoom,

                location:
                    defaultLocation,

                tags:
                    Array.isArray(
                        item.tags
                    )
                        ? item.tags
                        : [],

                description:
                    item.description ||
                    "",

                image_url:
                    imageUrl

            });


            savedCount++;

        }


        closeBatchModal();


        if (
            typeof loadItems ===
            "function"
        ) {

            await loadItems();

        }


        showMessage(
            `✅ Đã lưu thành công ${savedCount} món vào ${
                defaultRoom ||
                "danh sách"
            }!`
        );

    }
    catch (error) {

        console.error(
            "Batch save error:",
            error
        );


        showMessage(
            "❌ Lỗi khi lưu danh sách: " +
            error.message,
            "error"
        );

    }

}


// ============================================================
// INIT
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initMultiScan
);
