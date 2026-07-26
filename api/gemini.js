export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({

            error: "Method not allowed"

        });

    }

    try {

        const { imageBase64 } = req.body;

        const response = await fetch(

            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +

            process.env.GEMINI_API_KEY,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    contents: [

                        {

                            parts: [

                                {

                                    text: `Phân tích ảnh đồ vật trong nhà.

Trả về JSON:

{
"name":"",
"room":"",
"tags":[]
}

Chỉ trả JSON.`

                                },

                                {

                                    inline_data: {

                                        mime_type: "image/jpeg",

                                        data: imageBase64

                                    }

                                }

                            ]

                        }

                    ]

                })

            }

        );

        const data = await response.json();

        res.status(200).json(data);

    }

    catch (e) {

        res.status(500).json({

            error: e.message

        });

    }

}
