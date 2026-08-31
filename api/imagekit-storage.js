import {
    requireFirebaseUser
} from "./firebase-auth.js";

// api/imagekit-storage.js
//
// GET  ?action=list
// POST { action: "delete", paths: [...] }
//
// Private ImageKit API key chỉ nằm trên Vercel.

const IMAGEKIT_API =
    "https://api.imagekit.io/v1/files";


function setCors(
    res
) {

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

}


function authHeaders() {

    const privateKey =
        process.env
            .IMAGEKIT_PRIVATE_KEY;

    return {

        "Authorization":
            "Basic " +
            Buffer
                .from(
                    privateKey +
                    ":"
                )
                .toString(
                    "base64"
                ),

        "Accept":
            "application/json"

    };

}


async function listHomeAiFiles() {

    const url =
        new URL(
            IMAGEKIT_API
        );


    url.searchParams.set(
        "path",
        "/home-ai/"
    );

    url.searchParams.set(
        "limit",
        "1000"
    );

    url.searchParams.set(
        "type",
        "file"
    );


    const response =
        await fetch(
            url.toString(),
            {
                headers:
                    authHeaders()
            }
        );


    const data =
        await response.json();


    if (
        !response.ok
    ) {

        throw new Error(
            data.message ||
            "ImageKit list failed"
        );

    }


    return data;

}


async function deleteFileIds(
    fileIds
) {

    if (
        !fileIds ||
        fileIds.length === 0
    ) {

        return [];

    }


    const deleted = [];


    /*
     * ImageKit bulk delete tối đa 100 file/lần.
     */

    for (
        let i = 0;
        i < fileIds.length;
        i += 100
    ) {

        const chunk =
            fileIds.slice(
                i,
                i + 100
            );


        const response =
            await fetch(
                IMAGEKIT_API +
                "/batch/deleteByFileIds",
                {

                    method:
                        "POST",

                    headers: {

                        ...authHeaders(),

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            fileIds:
                                chunk
                        })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(
                data.message ||
                "ImageKit bulk delete failed"
            );

        }


        (
            data
                .successfullyDeletedFileIds ||
            []
        )
            .forEach(
                id =>
                    deleted.push(id)
            );

    }


    return deleted;

}


export default async function handler(
    req,
    res
) {

    setCors(
        res
    );


    if (
        req.method ===
        "OPTIONS"
    ) {

        return res
            .status(200)
            .end();

    }


    const user =
        await requireFirebaseUser(
            req,
            res
        );

    if (!user) {

        return;

    }


    if (
        !process.env
            .IMAGEKIT_PRIVATE_KEY
    ) {

        return res
            .status(500)
            .json({
                error:
                    "IMAGEKIT_PRIVATE_KEY is missing"
            });

    }


    try {

        /*
         * ================================================
         * LIST
         * ================================================
         */

        if (
            req.method ===
            "GET"
        ) {

            const files =
                await listHomeAiFiles();


            return res
                .status(200)
                .json({

                    files:
                        files.map(
                            file => ({

                                name:
                                    String(
                                        file.filePath ||
                                        ""
                                    )
                                    .replace(
                                        /^\/+/,
                                        ""
                                    ),

                                filePath:
                                    file.filePath,

                                fileId:
                                    file.fileId,

                                url:
                                    file.url

                            })
                        )

                });

        }


        /*
         * ================================================
         * DELETE
         * ================================================
         */

        if (
            req.method ===
            "POST"
        ) {

            const body =
                req.body || {};


            if (
                body.action !==
                "delete"
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid action"
                    });

            }


            const paths =
                Array.isArray(
                    body.paths
                )
                    ? body.paths
                    : [];


            if (
                paths.length === 0
            ) {

                return res
                    .status(200)
                    .json({
                        deleted:
                            []
                    });

            }


            const files =
                await listHomeAiFiles();


            const wanted =
                new Set(
                    paths.map(
                        path =>
                            "/" +
                            String(
                                path
                            )
                            .replace(
                                /^\/+/,
                                ""
                            )
                    )
                );


            const fileIds =
                files
                    .filter(
                        file =>
                            wanted.has(
                                file.filePath
                            )
                    )
                    .map(
                        file =>
                            file.fileId
                    );


            const deleted =
                await deleteFileIds(
                    fileIds
                );


            return res
                .status(200)
                .json({

                    deleted,

                    requested:
                        paths.length,

                    matched:
                        fileIds.length

                });

        }


        return res
            .status(405)
            .json({
                error:
                    "Method not allowed"
            });

    }
    catch (error) {

        console.error(
            "ImageKit storage error:",
            error
        );

        return res
            .status(500)
            .json({

                error:
                    error.message ||
                    "ImageKit storage operation failed"

            });

    }

}
