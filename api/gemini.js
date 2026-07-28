import { createVisionPrompt } from "./prompt.js";
import { cleanGeminiResponse } from "./response.js";

const MODEL = "gemini-flash-latest";

const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;

const TIMEOUT =
    60000;

async function callGemini(url, body) {

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => controller.abort(),
            TIMEOUT
        );

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

        clearTimeout(timeout);

        const result =
            await response.json();

        return {

            ok:
                response.ok,

            status:
                response.status,

            result

        };

    }
    finally {

        clearTimeout(timeout);

    }

}

export default async function handler(req, res) {

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
        "Content-Type"
    );

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }

    if (req.method !== "POST") {

        return res.status(405).json({

            error:
                "Method not allowed"

        });

    }

    try {

        const {

            imageBase64,

            mimeType,

            rooms

        } = req.body;

        if (!imageBase64) {

            return res.status(400).json({

                error:
                    "Missing image"

            });

        }

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const body = {

            contents: [

                {

                    parts: [

                        {

                            text:
                                createVisionPrompt(
                                    rooms || []
                                )

                        },

                        {

                            inline_data: {

                                mime_type:
                                    mimeType ||
                                    "image/jpeg",

                                data:
                                    imageBase64

                            }

                        }

                    ]

                }

            ],

            generationConfig: {

                temperature:
                    0.2,

                responseMimeType:
                    "application/json"

            }

        };

        let gemini =
            await callGemini(
                url,
                body
            );

        if (!gemini.ok) {

            console.warn(
                "Retry Gemini..."
            );

            gemini =
                await callGemini(
                    url,
                    body
                );

        }

        if (!gemini.ok) {

            console.error(
                "Gemini HTTP Error:",
                gemini.result
            );

            return res
                .status(
                    gemini.status
                )
                .json({

                    error:
                        "Gemini API Error",

                    detail:
                        gemini.result

                });

        }

        const text =
            gemini.result
                ?.candidates?.[0]
                ?.content
                ?.parts?.[0]
                ?.text || "";

        const ai =
            cleanGeminiResponse(
                text
            );

        return res
            .status(200)
            .json(ai);

    }
    catch (error) {

        console.error(
            "Gemini Error:",
            error
        );

        if (
            error.name ===
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
                    error.message ||
                    "Unknown error"

            });

    }

}