export function cleanGeminiResponse(text) {

    try {

        if (!text) {

            return {
                name: "",
                location: "",
                room: "",
                tags: [],
                description: ""
            };

        }


        // Xóa markdown nếu Gemini trả về
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


        // Tìm phần JSON nếu AI trả thêm chữ
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start !== -1 && end !== -1) {

            text = text.substring(start, end + 1);

        }


        const data = JSON.parse(text);


        return {

            name: data.name || "",

            location: data.location || "",

            room: data.room || "",

            tags: Array.isArray(data.tags)
                ? data.tags.slice(0, 5)
                : [],

            description: data.description || ""

        };


    } catch (error) {

        console.error(
            "Gemini JSON Parse Error:",
            error
        );


        return {

            name: "",

            location: "",

            room: "",

            tags: [],

            description: ""

        };

    }

}