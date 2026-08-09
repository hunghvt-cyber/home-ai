const SUPABASE_URL =
    "https://dypqawaqlrthhfxnmxom.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_tZwvgJDIo89qG7sqp5oIJg_GoFa8qMG";

const GEMINI_API_URL =
    "https://home-ai-two-topaz.vercel.app/api/gemini";

// Header chống spam endpoint /api/gemini (không phải bí mật tuyệt đối vì
// đây là code phía client - chỉ để chặn bot/scanner tự động, không phải
// hàng rào bảo mật cho dữ liệu nhạy cảm). Giá trị này PHẢI khớp đúng
// với biến môi trường APP_SECRET đã đặt trên Vercel.
const APP_SECRET =
    "Joker@x93";

const db =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );