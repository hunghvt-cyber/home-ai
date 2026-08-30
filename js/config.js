// js/config.js

const GEMINI_API_URL =
    "https://home-ai-two-topaz.vercel.app/api/gemini";

// Giá trị này hiện chỉ dùng như một lớp chống bot/scanner.
// Không coi đây là secret vì frontend phải biết giá trị này.
const APP_SECRET =
    "Joker@x93";

window.HOME_AI_APP_SECRET =
    APP_SECRET;

// Firestore + ImageKit adapter
// được khởi tạo trong js/firebase.js
const db =
    window.homeAiDb;
