import { serve } from "https://deno.land/std/http/server.ts";


serve(async (req) => {


    try {


        const { imageBase64 } =
            await req.json();



        const apiKey =
            Deno.env.get(
                "GEMINI_API_KEY"
            );



        const response =
            await fetch(

                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + apiKey,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                        "application/json"

                    },

                    body: JSON.stringify({

                        contents: [

                            {

                                parts: [

                                    {

                                        text:
`Phân tích ảnh đồ vật trong nhà.

Trả về JSON:

{
"name":"",
"room":"",
"tags":[]
}

Chỉ trả JSON.`

                                    },

                                    {

                                        inline_data: {

                                            mime_type:
                                            "image/jpeg",

                                            data:
                                            imageBase64

                                        }

                                    }

                                ]

                            }

                        ]

                    })

                }

            );



        const data =
            await response.json();



        return new Response(

            JSON.stringify(data),

            {

                headers: {

                    "Content-Type":
                    "application/json"

                }

            }

        );


    }
    catch(error) {


        return new Response(

            JSON.stringify({

                error:
                error.message

            }),

            {

                status:500,

                headers: {

                    "Content-Type":
                    "application/json"

                }

            }

        );


    }


});