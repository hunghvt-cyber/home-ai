let selectedFile = null;

function openCamera() {
    document.getElementById("cameraInput").click();
}

function openGallery() {
    document.getElementById("galleryInput").click();
}

function initImage() {

    document
        .getElementById("cameraInput")
        .addEventListener("change", handleImage);

    document
        .getElementById("galleryInput")
        .addEventListener("change", handleImage);

}

function handleImage(event) {

    const file = event.target.files[0];

    if (!file) return;

    selectedFile = file;

    const preview =
        document.getElementById("preview");

    preview.src =
        URL.createObjectURL(file);

    preview.style.display = "block";

    document
        .getElementById("selectedImage")
        .innerHTML =
        "📷 " + file.name;

}

async function analyzeImage() {

    if (!selectedFile) {

        showMessage("❌ Chưa có ảnh.");

        return;

    }

    try {

        const base64 =
            await fileToBase64(selectedFile);

        const cleanBase64 =
            base64.split(",")[1];

        const response =
            await fetch(
                "https://home-ai-two-topaz.vercel.app/api/gemini",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        imageBase64: cleanBase64
                    })
                }
            );

        const ai =
            await response.json();

        if (!response.ok) {

            throw new Error(
                ai.error ||
                JSON.stringify(ai, null, 2)
            );

        }

        if (ai.name) {

            document.getElementById("name").value =
                ai.name;

        }

        if (ai.location) {

            document.getElementById("location").value =
                ai.location;

        }

        if (ai.tags && Array.isArray(ai.tags)) {

            document.getElementById("tags").value =
                ai.tags.join(", ");

        }

        if (ai.room) {

            await selectRoom(ai.room);

        }

        showMessage("🤖 AI đã nhận diện xong.");

    }
    catch (error) {

        showMessage(
            "❌ AI lỗi\n\n" + error.message,
            "error"
        );

    }

}

async function selectRoom(aiRoom) {

    const select =
        document.getElementById("room");

    if (!select) return;

    const target =
        aiRoom.trim().toLowerCase();

    for (const option of select.options) {

        const value =
            option.value.trim().toLowerCase();

        if (value === target) {

            select.value =
                option.value;

            return;

        }

    }

    for (const option of select.options) {

        const value =
            option.value.trim().toLowerCase();

        if (
            value.includes(target) ||
            target.includes(value)
        ) {

            select.value =
                option.value;

            return;

        }

    }

    if (typeof db === "undefined") return;

    const result =
        await db
            .from("rooms")
            .insert([
                {
                    name: aiRoom
                }
            ]);

    if (!result.error) {

        await loadRooms();

        select.value =
            aiRoom;

    }

}

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();

        reader.onload =
            () => resolve(reader.result);

        reader.onerror =
            reject;

        reader.readAsDataURL(file);

    });

}

function initAI() {

    console.log("🤖 AI Ready");

}