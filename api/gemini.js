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

        const key = process.env.GEMINI_API_KEY;

        console.log("===== GEMINI DEBUG =====");
        console.log("Has key:", !!key);

        if (key) {
            console.log(
                "Key:",
                key.substring(0, 6) +
                "..." +
                key.substring(key.length - 4)
            );
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    // Test tối giản, KHÔNG gửi ảnh
                    contents: [
                        {
                            parts: [
                                {
                                    text: "Hello"
                                }
                            ]
                        }
                    ]

                })
            }
        );

        const text = await response.text();

        console.log("Status:", response.status);
        console.log("Gemini response:");
        console.log(text);

        return res.status(response.status).send(text);

    }
    catch (e) {

        console.error(e);

        return res.status(500).json({
            error: e.message
        });

    }

}