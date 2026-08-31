// js/ai/gemini-client.js

const GEMINI_TIMEOUT_MS = 60000;


async function callGeminiAPI(payload) {

    const user =
        firebase.auth().currentUser;

    if (!user) {

        throw new Error(
            "Vui lòng đăng nhập lại."
        );

    }


    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => controller.abort(),
            GEMINI_TIMEOUT_MS
        );

    try {

        const idToken =
            await user.getIdToken();


        const response =
            await fetch(
                GEMINI_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " +
                            idToken
                    },

                    signal:
                        controller.signal,

                    body:
                        JSON.stringify(payload)
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

        }

        return data;

    }
    catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "Hết thời gian chờ AI (60s)."
            );

        }

        throw error;

    }
    finally {

        clearTimeout(timeout);

    }

}
