let isAnalyzing = false;



async function analyzeImage() {

    if (isAnalyzing) {

        return;

    }



    if (!selectedFile) {

        showMessage(
            "❌ Chưa có ảnh."
        );

        return;

    }



    const aiButton =
        document.querySelector(
            'button[onclick="analyzeImage()"]'
        );



    isAnalyzing = true;



    if (aiButton) {

        aiButton.disabled = true;

        aiButton.innerHTML =
            "🤖 Đang phân tích...";

    }



    showMessage(
        "🤖 Đang phân tích..."
    );



    try {

        await sendImageToAI();

    }
    catch (error) {

        showMessage(
            "❌ AI lỗi\n\n" +
            error.message,
            "error"
        );

    }
    finally {

        isAnalyzing = false;

        if (aiButton) {

            aiButton.disabled = false;

            aiButton.innerHTML =
                "🤖 AI";

        }

    }

}





async function sendImageToAI() {

    const base64 =
        await fileToBase64(
            selectedFile
        );



    const cleanBase64 =
        base64.split(",")[1];



    const { data: rooms } =
        await db
            .from("rooms")
            .select("name");



    const roomList =
        rooms
            ? rooms.map(
                room => room.name
            )
            : [];



    const ai =
        await callGeminiAPI({

            imageBase64:
                cleanBase64,

            mimeType:
                selectedFile.type,

            rooms:
                roomList,

            mode:
                "single"

        });



    if (ai.name) {

        document
            .getElementById("name")
            .value =
            ai.name;

    }



    if (ai.location) {

        document
            .getElementById("location")
            .value =
            ai.location;

    }



    if (
        ai.tags &&
        Array.isArray(ai.tags)
    ) {

        document
            .getElementById("tags")
            .value =
            ai.tags.join(", ");

    }



    const description =
        document.getElementById(
            "description"
        );



    if (
        description &&
        ai.description
    ) {

        description.value =
            ai.description;

    }



    if (ai.room) {

        await selectRoom(
            ai.room
        );

    }



    showMessage(
        "🤖 AI đã nhận diện xong."
    );

}





async function selectRoom(aiRoom) {

    const select =
        document.getElementById(
            "room"
        );



    if (
        !select ||
        !aiRoom
    ) {

        return;

    }



    const target =
        aiRoom
            .trim()
            .toLowerCase();



    for (const option of select.options) {

        const value =
            option.value
                .trim()
                .toLowerCase();

        if (value === target) {

            select.value =
                option.value;

            return;

        }

    }



    for (const option of select.options) {

        const value =
            option.value
                .trim()
                .toLowerCase();

        if (

            value.includes(target) ||

            target.includes(value)

        ) {

            select.value =
                option.value;

            return;

        }

    }

}



function fileToBase64(file) {

    return new Promise(

        (resolve, reject) => {

            const reader =
                new FileReader();



            reader.onload =
                () => resolve(
                    reader.result
                );



            reader.onerror =
                reject;



            reader.readAsDataURL(
                file
            );

        }

    );

}





function initAI() {

    window.addEventListener(

        "offline",

        function() {

            showMessage(
                "📡 Mất kết nối Internet."
            );

        }

    );



    window.addEventListener(

        "online",

        function() {

            showMessage(
                "🌐 Đã kết nối Internet."
            );

        }

    );

}