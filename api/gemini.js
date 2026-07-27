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

        const prompt = req.body?.text || "Xin chào";

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": apiKey
                },
                body: JSON.stringify({

                    system_instruction: {
                        parts: [
                            {
                                text:
`Bạn là AI của ứng dụng Storage & Forget.

Luôn trả lời bằng tiếng Việt.

Nếu không biết thì nói không biết.

Không tự bịa thông tin.

Trả lời ngắn gọn, dễ hiểu.

`
                            }
                        ]
                    },

                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]

                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    }
    catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

}