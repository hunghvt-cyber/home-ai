import {
    createVisionPrompt,
    createMultiVisionPrompt,
    createLocatePrompt
} from "./prompt.js";

import {
    cleanGeminiResponse,
    cleanMultiGeminiResponse
} from "./response.js";

import {
    requireFirebaseUser
} from "./firebase-auth.js";


// ============================================================
// GEMINI CONFIG
// ============================================================

const PRIMARY_MODEL =
    "gemini-3.6-flash";

// Keep a single production model for predictable billing and behavior.
// Do not silently switch to another model.


const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;


const TIMEOUT =
    30000;


// ============================================================
// HELPERS
// ============================================================

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


function isRetryableStatus(status) {

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
    );

}


function getModelsToTry() {

    // Single-model policy: no model fallback.
    return [PRIMARY_MODEL];

}


// ============================================================
// GEMINI REQUEST
// ============================================================

async function callGemini(
    model,
    body
) {

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => controller.abort(),
            TIMEOUT
        );

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    try {

        const response =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body),

                    signal:
                        controller.signal
                }
            );

        let result = {};

        try {

            result =
                await response.json();

        }
        catch {

            result = {
                error: {
                    message:
                        "Gemini returned invalid JSON."
                }
            };

        }

        return {

            ok:
                response.ok,

            status:
                response.status,

            result,

            model

        };

    }
    catch (error) {

        if (
            error &&
            error.name ===
            "AbortError"
        ) {

            return {

                ok: false,

                status: 408,

                result: {
                    error: {
                        message:
                            "Gemini request timeout."
                    }
                },

                model

            };

        }

        return {

            ok: false,

            status: 500,

            result: {
                error: {
                    message:
                        error?.message ||
                        "Gemini network error."
                }
            },

            model

        };

    }
    finally {

        clearTimeout(timeout);

    }

}


// ============================================================
// RESPONSE PROCESSOR
// ============================================================

function processGeminiResult(
    res,
    result,
    mode,
    model
) {

    const text =
        result
            ?.candidates?.[0]
            ?.content
            ?.parts?.[0]
            ?.text ||
        "";

    if (!text) {

        console.error(
            "[Gemini] Empty response:",
            result
        );

        return res
            .status(502)
            .json({

                error:
                    "Gemini returned an empty response.",

                model,

                detail:
                    result

            });

    }

    try {

        let ai;
        if (mode === "multi") {
            ai = cleanMultiGeminiResponse(text);
        } else if (mode === "locate") {
            try {
                ai = JSON.parse(text);
            } catch (e) {
                console.error("[Gemini] Failed to parse locate JSON", text);
                ai = { message: "Có lỗi khi xử lý câu trả lời từ AI." };
            }
        } else {
            ai = cleanGeminiResponse(text);
        }

        return res
            .status(200)
            .json(ai);

    }
    catch (error) {

        console.error(
            "[Gemini] Response parsing error:",
            error
        );

        return res
            .status(502)
            .json({

                error:
                    "Gemini response parsing failed.",

                model,

                detail:
                    error?.message ||
                    "Invalid Gemini response.",

                raw:
                    text

            });

    }

}


// ============================================================
// API HANDLER
// ============================================================

export default async function handler(
    req,
    res
) {

    // --------------------------------------------------------
    // CORS
    // --------------------------------------------------------

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );


    // --------------------------------------------------------
    // OPTIONS
    // --------------------------------------------------------

    if (
        req.method === "OPTIONS"
    ) {

        return res
            .status(200)
            .end();

    }


    // --------------------------------------------------------
    // METHOD
    // --------------------------------------------------------

    if (
        req.method !== "POST"
    ) {

        return res
            .status(405)
            .json({
                error:
                    "Method not allowed"
            });

    }


    const user =
        await requireFirebaseUser(
            req,
            res
        );

    if (!user) {

        return;

    }


    // --------------------------------------------------------
    // API KEY
    // --------------------------------------------------------

    if (!GEMINI_API_KEY) {

        console.error(
            "[Gemini] GEMINI_API_KEY missing."
        );

        return res
            .status(500)
            .json({
                error:
                    "Gemini API key is not configured."
            });

    }


    // --------------------------------------------------------
    // REQUEST
    // --------------------------------------------------------

    try {

        const body =
            req.body || {};

        const {
            imageBase64,
            mimeType,
            rooms,
            mode = "single",
            mediaResolution,
            question,
            items
        } = body;


        if (
            mode !== "locate" &&
            !imageBase64
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Missing image"
                });

        }


        const normalizedMode =
            mode === "multi"
                ? "multi"
                : (mode === "locate" ? "locate" : "single");


        // ----------------------------------------------------
        // VALIDATE
        // ----------------------------------------------------

        if (normalizedMode === "locate") {
            if (typeof question !== "string" || question.trim() === "" || !Array.isArray(items)) {
                return res.status(400).json({
                    error: "Invalid request for locate mode. 'question' (string) and 'items' (array) are required."
                });
            }
        }


        // ----------------------------------------------------
        // PROMPT
        // ----------------------------------------------------

        let promptText;
        if (normalizedMode === "multi") {
            promptText = createMultiVisionPrompt();
        } else if (normalizedMode === "locate") {
            promptText = createLocatePrompt(items, question);
        } else {
            promptText = createVisionPrompt(
                Array.isArray(rooms)
                    ? rooms
                    : []
            );
        }


        // ----------------------------------------------------
        // GEMINI BODY
        // ----------------------------------------------------

        const parts = [
            { text: promptText }
        ];

        if (normalizedMode !== "locate") {
            parts.push({
                inline_data: {
                    mime_type: mimeType || "image/jpeg",
                    data: imageBase64
                }
            });
        }

        const allowedMediaResolutions = new Set([
            "MEDIA_RESOLUTION_LOW",
            "MEDIA_RESOLUTION_MEDIUM",
            "MEDIA_RESOLUTION_HIGH"
        ]);

        const normalizedMediaResolution =
            allowedMediaResolutions.has(mediaResolution)
                ? mediaResolution
                : "MEDIA_RESOLUTION_MEDIUM";

        function buildGeminiBody(model) {

            // Keep the request body minimal while validating the production path.
            // Client-side image resizing remains enabled; Gemini-side resolution/thinking
            // controls are temporarily omitted until the API request is proven stable.
            const generationConfig = {
                responseMimeType:
                    "application/json"
            };

            return {
                contents: [
                    {
                        parts: parts
                    }
                ],
                generationConfig
            };
        }


        // ----------------------------------------------------
        // MODEL
        // ----------------------------------------------------

        const models = getModelsToTry();


        console.log(
            "[Gemini] Models:",
            models.join(", ")
        );


        let lastResult =
            null;


        // ----------------------------------------------------
        // MODEL LOOP
        // ----------------------------------------------------

        for (
            let index = 0;
            index < models.length;
            index++
        ) {

            const currentModel =
                models[index];


            console.log(
                `[Gemini] Trying ${currentModel}`
            );


            // ------------------------------------------------
            // FIRST REQUEST
            // ------------------------------------------------

            const geminiBody =
                buildGeminiBody(currentModel);

            let gemini =
                await callGemini(
                    currentModel,
                    geminiBody
                );


            if (
                gemini.ok
            ) {

                console.log(
                    `[Gemini] Success: ${currentModel}`
                );

                return processGeminiResult(
                    res,
                    gemini.result,
                    normalizedMode,
                    currentModel
                );

            }


            lastResult =
                gemini;


            console.warn(
                `[Gemini] ${currentModel} failed:`,
                gemini.status,
                gemini.result
            );


            // ------------------------------------------------
            // RETRY TRANSIENT ERROR
            // ------------------------------------------------

            if (
                isRetryableStatus(
                    gemini.status
                )
            ) {

                await sleep(1200);


                console.log(
                    `[Gemini] Retrying ${currentModel}`
                );


                gemini =
                    await callGemini(
                        currentModel,
                        geminiBody
                    );


                if (
                    gemini.ok
                ) {

                    console.log(
                        `[Gemini] Retry success: ${currentModel}`
                    );

                    return processGeminiResult(
                        res,
                        gemini.result,
                        normalizedMode,
                        currentModel
                    );

                }


                lastResult =
                    gemini;


                console.warn(
                    `[Gemini] Retry failed ${currentModel}:`,
                    gemini.status,
                    gemini.result
                );

            }




        }


        // ----------------------------------------------------
        // ALL FAILED
        // ----------------------------------------------------

        console.error(
            "[Gemini] Model failed after retry:",
            lastResult
        );


        const status =
            lastResult?.status &&
            Number.isInteger(
                lastResult.status
            )
                ? lastResult.status
                : 503;


        return res
            .status(status)
            .json({

                error:
                    "Gemini API Error",

                model:
                    lastResult?.model ||
                    null,

                detail:
                    lastResult?.result ||
                    {
                        error: {
                            message:
                                "Gemini request failed after retry."
                        }
                    }

            });

    }
    catch (error) {

        console.error(
            "[Gemini] Handler error:",
            error
        );


        if (
            error?.name ===
            "AbortError"
        ) {

            return res
                .status(408)
                .json({
                    error:
                        "Gemini timeout"
                });

        }


        return res
            .status(500)
            .json({

                error:
                    error?.message ||
                    "Unknown error"

            });

    }

}
