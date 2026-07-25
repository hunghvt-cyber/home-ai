const SUPABASE_URL =
    "https://dypqawaqlrthhfxnmxom.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_tZwvgJDIo89qG7sqp5oIJg_GoFa8qMG";

const db =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );