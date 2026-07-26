async function analyzeImage() {


    if (!selectedFile) {

        showMessage(
            "❌ Chưa có ảnh."
        );

        return;

    }


    try {


        const base64 =
            await fileToBase64(
                selectedFile
            );


        const cleanBase64 =
            base64.split(",")[1];



        const response =
            await fetch(

                SUPABASE_URL +
                "/functions/v1/gemini",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                        "application/json",

                        "apikey":
                        SUPABASE_KEY,

                        "Authorization":
                        "Bearer " +
                        SUPABASE_KEY

                    },

                    body:
                    JSON.stringify({

                        imageBase64:
                        cleanBase64

                    })

                }

            );



        const data =
            await response.json();



        if (!response.ok) {

            throw new Error(

                data.message ||

                JSON.stringify(data)

            );

        }



        let text =
            data
            .candidates[0]
            .content
            .parts[0]
            .text;



        text =
            text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();



        const ai =
            JSON.parse(text);



        if (ai.name) {

            document
                .getElementById("name")
                .value =
                ai.name;

        }



        if (ai.room) {

            document
                .getElementById("room")
                .value =
                ai.room;

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



        showMessage(
            "🤖 AI đã gợi ý xong."
        );


    }
    catch (error) {


        showMessage(
            "❌ " +
            error.message
        );


    }


}





function fileToBase64(file) {


    return new Promise(

        (resolve, reject) => {


            const reader =
                new FileReader();


            reader.onload =
                () =>
                resolve(
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


    console.log(
        "🤖 AI Ready"
    );


}
