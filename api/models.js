export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const appSecret = req.headers["x-app-secret"];

  if (
    !process.env.APP_SECRET ||
    appSecret !== process.env.APP_SECRET
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {

    return res.status(500).json({
      error: "Failed to query Gemini",
      detail: error.message
    });

  }
}
