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

            error: "Method not allowed"

        });

    }

    try {

        const { imageBase64 } = req.body;

        const response =
            await fetch(

                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +

                process.env.GEMINI_API_KEY,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        contents: [

                            {

                                parts: [

                                    {

                                        text: `Phân tích ảnh đồ vật trong nhà.

Trả về đúng JSON:

{
"name":"",
"room":"",
"tags":[]
}

Không giải thích.
Không markdown.
Không \`\`\`.`

                                    },

                                    {

                                        inline_data: {

                                            mime_type:
                                                "image/jpeg",

                                            data:
                                                imageBase64

                                        }

                                    }

                                ]

                            }

                        ]

                    })

                }

            );



        const data =
            await response.json();



        if (!response.ok) {

            return res.status(500).json({

                error:
                    "Gemini HTTP Error",

                gemini:
                    data

            });

        }



        if (!data.candidates) {

            return res.status(500).json({

                error:
                    "Gemini không trả candidates",

                gemini:
                    data

            });

        }



        return res.status(200).json(data);

    }

    catch (e) {

        return res.status(500).json({

            error:
                e.message

        });

    }

}
