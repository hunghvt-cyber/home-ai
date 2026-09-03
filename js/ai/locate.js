// js/ai/locate.js

// Assuming callGeminiAPI is available globally
// Assuming filterItems is available globally

async function askAILocation() {
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
        // filterItems nằm trong js/search/filter.js
        const filteredItems = filterItems(question);

        // Chọn tối đa 10 item phù hợp nhất
        const itemsToAnalyze = filteredItems.slice(0, 10).map(item => ({
            name: item.name,
            location: item.location,
            room: item.room,
            tags: item.tags,
            description: item.description
        }));

        // Gọi callGeminiAPI
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
