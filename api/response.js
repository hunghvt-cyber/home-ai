const EMPTY_RESPONSE = {

    name: "",

    location: "",

    room: "",

    tags: [],

    description: ""

};



export function cleanGeminiResponse(text) {

    try {

        if (!text) {

            return {

                ...EMPTY_RESPONSE

            };

        }



        let json = text.trim();



        json = json.replace(

            /^```json/i,

            ""

        );



        json = json.replace(

            /^```/,

            ""

        );



        json = json.replace(

            /```$/,

            ""

        );



        const parsed = JSON.parse(

            json.trim()

        );



        return {

            name:
                typeof parsed.name === "string"
                    ? parsed.name.trim()
                    : "",

            location:
                typeof parsed.location === "string"
                    ? parsed.location.trim()
                    : "",

            room:
                typeof parsed.room === "string"
                    ? parsed.room.trim()
                    : "",

            tags:
                Array.isArray(parsed.tags)
                    ? parsed.tags
                        .filter(
                            tag =>
                                typeof tag === "string"
                        )
                        .map(
                            tag => tag.trim()
                        )
                    : [],

            description:
                typeof parsed.description === "string"
                    ? parsed.description.trim()
                    : ""

        };

    }
    catch (error) {

        console.error(

            "JSON Parse Error:",

            error,

            text

        );

        return {

            ...EMPTY_RESPONSE

        };

    }

}



export function cleanMultiGeminiResponse(text) {

    try {

        if (!text) {

            return { items: [] };

        }

        let json = text.trim();

        json = json.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "");

        const parsed = JSON.parse(json.trim());

        if (!parsed || !Array.isArray(parsed.items)) {

            return { items: [] };

        }

        const items = parsed.items.map(item => ({

            name: typeof item.name === "string" ? item.name.trim() : "",

            tags: Array.isArray(item.tags)
                ? item.tags.filter(t => typeof t === "string").map(t => t.trim())
                : [],

            description: typeof item.description === "string" ? item.description.trim() : ""

        })).filter(item => item.name !== "");

        return { items };

    }
    catch (error) {

        console.error("Multi JSON Parse Error:", error, text);

        return { items: [] };

    }

}
