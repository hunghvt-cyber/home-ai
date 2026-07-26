async function analyzeImage() {


    if (!selectedFile) {

        showMessage(
            "❌ Chưa có ảnh."
        );

        return null;

    }



    try {


        const base64 =
            await fileToBase64(
                selectedFile
            );



        const cleanBase64 =
            base64
            .split(",")[1];



        const result =
            await fetch(

                SUPABASE_URL +
                "/functions/v1/gemini",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json",

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
            await result.json();



        return data;



    }
    catch(error) {


        showMessage(
            "❌ AI lỗi: " +
            error.message
        );


        return null;

    }


}





function fileToBase64(file) {


    return new Promise(
        (resolve,reject)=>{


            const reader =
                new FileReader();



            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };



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
        "🤖 AI ready"
    );


}