// js/ai/burst-capture.js

const BURST_CONCURRENCY = 3;


// ============================================================
// OPEN BURST
// ============================================================

function openBurstCapture() {

    const input =
        document.getElementById(
            "burstCaptureInput"
        );

    if (input) {

        input.click();

    }

}


// ============================================================
// INIT
// ============================================================

function initBurstCapture() {

    const input =
        document.getElementById(
            "burstCaptureInput"
        );

    if (input) {

        input.addEventListener(
            "change",
            handleBurstCaptureImages
        );

    }

}


// ============================================================
// ANALYZE ONE IMAGE
// ============================================================

async function analyzeOneBurstImage(
    file,
    index,
    roomList
) {

    try {

        const base64 =
            await fileToBase64(
                file
            );


        const cleanBase64 =
            base64.split(",")[1];


        const ai =
            await callGeminiAPI({

                imageBase64:
                    cleanBase64,

                mimeType:
                    file.type,

                rooms:
                    roomList,

                mode:
                    "single"

            });


        return {

            // IMPORTANT:
            // Mỗi Burst item giữ FILE RIÊNG.
            file:
                file,

            previewUrl:
                URL.createObjectURL(
                    file
                ),

            name:
                ai.name ||
                `Món đồ ${index + 1}`,

            location:
                ai.location ||
                "",

            room:
                ai.room ||
                "",

            tags:
                Array.isArray(
                    ai.tags
                )
                    ? ai.tags
                    : [],

            description:
                ai.description ||
                "",

            selected:
                true

        };

    }
    catch (error) {

        console.warn(
            `Lỗi xử lý ảnh ${index + 1}:`,
            error
        );


        return {

            file:
                file,

            previewUrl:
                URL.createObjectURL(
                    file
                ),

            name:
                `Món đồ ${index + 1}`,

            location:
                "",

            room:
                "",

            tags:
                [],

            description:
                "",

            selected:
                true

        };

    }

}


// ============================================================
// BURST PROCESSING
// ============================================================

async function handleBurstCaptureImages(
    event
) {

    const files =
        Array.from(
            event.target.files || []
        );


    event.target.value = "";


    if (
        files.length === 0
    ) {

        return;

    }


    const statusBox =
        document.getElementById(
            "burstStatusBox"
        );

    const statusText =
        document.getElementById(
            "burstStatusText"
        );

    const progressBar =
        document.getElementById(
            "burstProgressBar"
        );


    if (statusBox) {

        statusBox.style.display =
            "block";

    }


    let roomList = [];


    try {

        const result =
            await db
                .from("rooms")
                .select("name");


        const roomsData =
            result.data;


        roomList =
            roomsData
                ? roomsData.map(
                    room =>
                        room.name
                )
                : [];

    }
    catch (error) {

        console.warn(
            "Không lấy được danh sách phòng:",
            error
        );

    }


    const processedBatch =
        new Array(
            files.length
        );


    let doneCount = 0;


    // ========================================================
    // PROCESS IN CHUNKS
    // ========================================================

    for (
        let start = 0;
        start < files.length;
        start += BURST_CONCURRENCY
    ) {

        const chunk =
            files.slice(
                start,
                start +
                BURST_CONCURRENCY
            );


        const results =
            await Promise.all(
                chunk.map(
                    function(
                        file,
                        offset
                    ) {

                        return analyzeOneBurstImage(
                            file,
                            start + offset,
                            roomList
                        );

                    }
                )
            );


        results.forEach(
            function(
                result,
                offset
            ) {

                processedBatch[
                    start + offset
                ] =
                    result;

            }
        );


        doneCount +=
            chunk.length;


        const progressPercent =
            Math.round(
                (
                    doneCount /
                    files.length
                ) *
                100
            );


        if (statusText) {

            statusText.innerText =
                `⚡ Đang phân tích ảnh ${doneCount}/${files.length}...`;

        }


        if (progressBar) {

            progressBar.style.width =
                `${progressPercent}%`;

        }

    }


    if (statusBox) {

        statusBox.style.display =
            "none";

    }


    currentBatchItems =
        processedBatch;


    renderBatchModal();


    showMessage(
        `⚡ Đã xử lý xong ${files.length} ảnh trong Burst Mode!`
    );

}


// ============================================================
// INIT
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initBurstCapture
);
