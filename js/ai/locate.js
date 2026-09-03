// js/ai/locate.js

import {
    callGeminiAPI
} from "./gemini-client.js";

import {
    filterItems
} from "../search/filter.js";

// Đảm bảo allItems khả dụng (giả định allItems là biến global được load ở nơi khác)
// Nếu không phải, cần import từ js/database/load.js

export async function askAILocation() {
    const searchInput = document.getElementById("search");
    const resultDiv = document.getElementById("aiSearchResult");

    if (!searchInput || !resultDiv) {
        console.error("Missing UI elements: #search or #aiSearchResult");
        return;
    }

    const question = searchInput.value.trim();

    if (!question) {
        return;
    }

    // Trạng thái loading
    resultDiv.innerHTML = "🤖 AI đang tìm kiếm...";
    resultDiv.style.display = "block";

    try {
        // Lọc local sử dụng filterItems hiện có
        // Lưu ý: filterItems không nhận tham số, nó đọc trực tiếp DOM?
        // Theo grep, filterItems nhận 1 tham số 'keyword'.
        const filteredItems = filterItems(question);

        // Chọn tối đa 10 item phù hợp nhất
        const itemsToAnalyze = filteredItems.slice(0, 10).map(item => ({
            name: item.name,
            location: item.location,
            room: item.room,
            tags: item.tags,
            description: item.description
        }));

        // Gọi callGeminiAPI với mode "locate"
        const response = await callGeminiAPI({
            mode: "locate",
            question: question,
            items: itemsToAnalyze
        });

        // Hiển thị kết quả
        if (response && response.message) {
            resultDiv.innerHTML = "<strong>Kết quả:</strong> ";
            const msgSpan = document.createElement("span");
            msgSpan.textContent = response.message;
            resultDiv.appendChild(msgSpan);
        } else {
            resultDiv.textContent = "⚠️ Không nhận được câu trả lời từ AI.";
        }

    } catch (error) {
        console.error("[Locate] Error:", error);
        resultDiv.textContent = "❌ Có lỗi xảy ra khi tìm kiếm: " + (error.message || "Lỗi không xác định.");
    }
}

window.askAILocation = askAILocation;
