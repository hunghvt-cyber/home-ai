// js/ai/burst-capture.js

const BURST_CONCURRENCY = 3;

function openBurstCapture() {

    const input =
        document.getElementById(
            "burstCaptureInput"
        );

    if (input) {

        input.click();

    }

}

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

async function analyzeOneBurstImage(file, index, roomList) {

    try {

        const base64 =
            await fileToBase64(file);

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

            file: file,

            previewUrl:
                URL.createObjectURL(file),

            name:
                ai.name || `Món đồ ${index + 1}`,

            tags:
                ai.tags || [],

            description:
                ai.description || "",

            selected: true

        };

    }
    catch (error) {

        console.warn(
            `Lỗi xử lý ảnh ${index + 1}:`,
            error
        );

        return {

            file: file,

            previewUrl:
                URL.createObjectURL(file),

            name:
                `Món đồ ${index + 1}`,

            tags: [],

            description: "",

            selected: true

        };

    }

}

async function handleBurstCaptureImages(event) {

    const files =
        Array.from(
            event.target.files || []
        );

    event.target.value = "";

    if (files.length === 0) {

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

        const { data: roomsData } =
            await db
                .from("rooms")
                .select("name");

        roomList =
            roomsData
                ? roomsData.map(r => r.name)
                : [];

    }
    catch (e) {

        console.warn(
            "Không lấy được danh sách phòng:",
            e
        );

    }

    const processedBatch =
        new Array(files.length);

    let doneCount = 0;

    // Xử lý song song từng nhóm nhỏ (BURST_CONCURRENCY ảnh/lượt)
    // thay vì tuần tự từng ảnh -> nhanh hơn đáng kể khi burst nhiều ảnh,
    // đồng thời không gửi quá nhiều request cùng lúc lên Gemini.
    for (
        let start = 0;
        start < files.length;
        start += BURST_CONCURRENCY
    ) {

        const chunk =
            files.slice(
                start,
                start + BURST_CONCURRENCY
            );

        const results =
            await Promise.all(

                chunk.map(function(file, i) {

                    return analyzeOneBurstImage(
                        file,
                        start + i,
                        roomList
                    );

                })

            );

        results.forEach(function(result, i) {

            processedBatch[start + i] =
                result;

        });

        doneCount +=
            chunk.length;

        const progressPercent =
            Math.round(
                (doneCount / files.length) * 100
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

document.addEventListener(
    "DOMContentLoaded",
    initBurstCapture
);