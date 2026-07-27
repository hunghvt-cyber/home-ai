import { VISION_PROMPT } from "./prompt.js";
import { cleanGeminiResponse } from "./response.js";


// Gemini model
const MODEL = "gemini-2.5-flash";


// API Key
const GEMINI_API_KEY = "YOUR_API_KEY";


// Gemini Vision
export async function analyzeImage(base64Image, mimeType = "image/jpeg") {

    try {


        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;



        const body = {

            contents: [

                {

                    parts: [

                        {
                            text: VISION_PROMPT
                        },

                        {

                            inline_data: {

                                mime_type: mimeType,

                                data: base64Image

                            }

                        }

                    ]

                }

            ],


            generationConfig: {

                temperature: 0.2,

                responseMimeType: "application/json"

            }

        };



        const response = await fetch(
            url,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(body)

            }
        );



        const result = await response.json();



        if (!response.ok) {

            console.error(
                "Gemini HTTP Error:",
                result
            );

            throw new Error(
                "Gemini API Error"
            );

        }



        const text =
            result
                ?.candidates?.[0]
                ?.content
                ?.parts?.[0]
                ?.text || "";



        return cleanGeminiResponse(text);



    } catch (error) {


        console.error(
            "Gemini Error:",
            error
        );


        return {

            name: "",

            location: "",

            room: "",

            tags: [],

            description: ""

        };

    }

}