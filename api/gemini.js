export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "Missing GEMINI_API_KEY"
            });
        }

        const text =
            req.body?.text || "";

        const imageBase64 =
            req.body?.imageBase64 || null;

        const isVision =
            !!imageBase64;

        const systemPrompt = isVision ?

`Bạn là AI của ứng dụng Storage & Forget.

Luôn trả lời bằng tiếng Việt.

Nhiệm vụ:

- Nhận diện đồ vật trong ảnh.
- Đoán vị trí cất giữ hợp lý.
- Chọn phòng phù hợp.
- Sinh tag để tìm kiếm.

Chỉ trả về JSON.

Định dạng:

{
  "name":"",
  "location":"",
  "room":"",
  "tags":[],
  "description":"",
  "confidence":0.0
}

Quy tắc:

- Không Markdown.
- Không dùng \`\`\`json.
- Không giải thích.
- Chỉ JSON.
`

:

`Bạn là AI của ứng dụng Storage & Forget.

Luôn trả lời bằng tiếng Việt.

Không bịa thông tin.

Trả lời ngắn gọn.
`;

        const parts = [];

        if (isVision) {

            parts.push({
                text:
"Phân tích ảnh và trả đúng JSON."
            });

            parts.push({

                inline_data: {

                    mime_type:
                    "image/jpeg",

                    data:
                    imageBase64

                }

            });

        }
        else {

            parts.push({

                text:
                text || "Xin chào"

            });

        }

        const response =
            await fetch(

                "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                        "application/json",

                        "X-goog-api-key":
                        apiKey

                    },

                    body: JSON.stringify({

                        system_instruction: {

                            parts: [

                                {

                                    text:
                                    systemPrompt

                                }

                            ]

                        },

                        contents: [

                            {

                                role:
                                "user",

                                parts:
                                parts

                            }

                        ]

                    })

                }

            );

        const data =
            await response.json();
        if (!response.ok) {

            return res
                .status(response.status)
                .json(data);

        }

        if (!isVision) {

            return res
                .status(200)
                .json(data);

        }

        try {

            let text =
                data
                .candidates?.[0]
                ?.content
                ?.parts?.[0]
                ?.text || "";

            text = text
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            const ai =
                JSON.parse(text);

            return res
                .status(200)
                .json(ai);

        }
        catch (e) {

            return res
                .status(500)
                .json({

                    error:
                    "AI trả JSON không hợp lệ.",

                    raw:
                    data

                });

        }

    }
    catch (err) {

        return res
            .status(500)
            .json({

                error:
                err.message

            });

    }

}