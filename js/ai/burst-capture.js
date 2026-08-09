// js/ai/burst-capture.js

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

    const processedBatch = [];

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        const progressPercent =
            Math.round(((i + 1) / files.length) * 100);

        if (statusText) {

            statusText.innerText =
                `⚡ Đang phân tích ảnh ${i + 1}/${files.length}...`;

        }

        if (progressBar) {

            progressBar.style.width =
                `${progressPercent}%`;

        }

        try {

            const base64 =
                await fileToBase64(file);

            const cleanBase64 =
                base64.split(",")[1];

            const response =
                await fetch(

                    GEMINI_API_URL,

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

                            rooms:
                                roomList,

                            mode:
                                "single"

                        })

                    }

                );

            const ai =
                await response.json();

            processedBatch.push({

                file: file,

                previewUrl:
                    URL.createObjectURL(file),

                name:
                    ai.name || `Món đồ ${i + 1}`,

                tags:
                    ai.tags || [],

                description:
                    ai.description || "",

                selected: true

            });

        }
        catch (error) {

            console.warn(
                `Lỗi xử lý ảnh ${i + 1}:`,
                error
            );

            processedBatch.push({

                file: file,

                previewUrl:
                    URL.createObjectURL(file),

                name:
                    `Món đồ ${i + 1}`,

                tags: [],

                description: "",

                selected: true

            });

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
