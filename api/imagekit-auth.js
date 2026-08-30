import crypto from "crypto";

export default async function handler(req, res) {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const privateKey =
        process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
        console.error(
            "IMAGEKIT_PRIVATE_KEY is missing"
        );

        return res.status(500).json({
            error:
                "ImageKit private key is not configured"
        });
    }

    try {
        const token =
            crypto.randomUUID();

        const expire =
            Math.floor(Date.now() / 1000) + 1800;

        const signature =
            crypto
                .createHmac(
                    "sha1",
                    privateKey
                )
                .update(
                    token + expire
                )
                .digest("hex");

        return res.status(200).json({
            token,
            expire,
            signature
        });

    } catch (error) {
        console.error(
            "ImageKit auth error:",
            error
        );

        return res.status(500).json({
            error:
                "Failed to generate ImageKit authentication"
        });
    }
}
