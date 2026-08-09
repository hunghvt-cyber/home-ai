// js/ai/gemini-client.js
// Hàm dùng chung để gọi API Gemini (dùng lại cho vision.js, multi-scan.js, burst-capture.js)
// Có sẵn: timeout 60s (AbortController), gửi kèm header bí mật chống spam endpoint.

const GEMINI_TIMEOUT_MS = 60000;

// Header bí mật đơn giản - chặn được bot/scanner random tìm URL để spam,
// KHÔNG phải bảo mật tuyệt đối vì đây là code client-side (ai xem source cũng thấy được).
// Phải khớp với APP_SECRET đặt trong Vercel Environment Variables.
const APP_SECRET_HEADER =
    "x-app-secret";

const APP_SECRET_VALUE =
    typeof APP_SECRET !== "undefined"
        ? APP_SECRET
        : "";


async function callGeminiAPI(payload) {

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => controller.abort(),
            GEMINI_TIMEOUT_MS
        );

    try {

        const response =
            await fetch(

                GEMINI_API_URL,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        [APP_SECRET_HEADER]:
                            APP_SECRET_VALUE

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

        if (error.name === "AbortError") {

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