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