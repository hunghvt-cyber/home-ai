// js/firebase.js

const FIREBASE_CONFIG = {
    apiKey:
        "AIzaSyDVGwWuRpdoFJCGhYDG5drIKFqVJp0O3Ro",

    authDomain:
        "home-ai-55a88.firebaseapp.com",

    projectId:
        "home-ai-55a88",

    storageBucket:
        "home-ai-55a88.firebasestorage.app",

    messagingSenderId:
        "187947750301",

    appId:
        "1:187947750301:web:3c5b16b16352e0ab71d574"
};


const IMAGEKIT_PUBLIC_KEY =
    "public_dZe8G/hzBOxyyd0dwk85tSdyDmQ=";


const IMAGEKIT_URL_ENDPOINT =
    "https://ik.imagekit.io/hunghvt";


const IMAGEKIT_AUTH_URL =
    "https://home-ai-two-topaz.vercel.app/api/imagekit-auth";


const IMAGEKIT_STORAGE_URL =
    "https://home-ai-two-topaz.vercel.app/api/imagekit-storage";


const IMAGEKIT_FOLDER =
    "/home-ai";


/* =========================================================
   FIREBASE
   ========================================================= */

if (!firebase.apps.length) {

    firebase.initializeApp(
        FIREBASE_CONFIG
    );

}


const firestore =
    firebase.firestore();


/* =========================================================
   HELPERS
   ========================================================= */

function generateId() {

    return (
        Date.now() +
        Math.floor(
            Math.random() * 100000
        )
    ).toString();

}


function cloneValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return value;

    }


    if (
        typeof value === "object"
    ) {

        return JSON.parse(
            JSON.stringify(value)
        );

    }


    return value;

}


function normalizeFirestoreData(
    data,
    id
) {

    const result = {};


    Object.keys(data || {})
        .forEach(
            key => {

                const value =
                    data[key];


                if (
                    value &&
                    typeof value.toDate ===
                    "function"
                ) {

                    result[key] =
                        value
                            .toDate()
                            .toISOString();

                }
                else {

                    result[key] =
                        cloneValue(value);

                }

            }
        );


    if (
        id !== undefined &&
        result.id === undefined
    ) {

        result.id = id;

    }


    return result;

}


function projectFields(
    row,
    fields
) {

    if (
        !fields ||
        fields === "*" ||
        (
            typeof fields === "string" &&
            fields.trim() === "*"
        )
    ) {

        return cloneValue(row);

    }


    const names =
        String(fields)
            .split(",")
            .map(
                x =>
                    x.trim()
            )
            .filter(Boolean);


    const result = {};


    names.forEach(
        name => {

            if (
                Object.prototype
                    .hasOwnProperty
                    .call(
                        row,
                        name
                    )
            ) {

                result[name] =
                    row[name];

            }

        }
    );


    return result;

}


/* =========================================================
   FIRESTORE QUERY
   Supabase-compatible query builder
   ========================================================= */

class FirestoreQuery {

    constructor(
        collectionName
    ) {

        this.collectionName =
            collectionName;


        this.operation =
            "select";


        this.filters = [];


        this.orderByField =
            null;


        this.orderAscending =
            true;


        this.selectedFields =
            "*";


        this.insertRows =
            null;


        this.updateData =
            null;


        /*
         * true when Supabase-style
         * .select() follows a write operation.
         *
         * Example:
         *
         * insert(...).select()
         * update(...).select()
         * delete().select()
         */
        this.returning =
            false;


        /*
         * Supabase:
         *
         * .single()
         * .maybeSingle()
         */
        this.singleMode =
            null;


        this.limitCount =
            null;

    }


    /* =====================================================
       SELECT
       ===================================================== */

    select(
        fields = "*"
    ) {

        this.selectedFields =
            fields;


        /*
         * IMPORTANT:
         *
         * Do NOT change insert/update/delete
         * into select here.
         *
         * Old broken code:
         *
         * this.operation = "select";
         *
         * That caused:
         *
         * insert().select()
         *
         * to become SELECT instead of INSERT.
         */

        if (
            this.operation ===
            "select"
        ) {

            this.operation =
                "select";

        }
        else {

            this.returning =
                true;

        }


        return this;

    }


    /* =====================================================
       SINGLE / MAYBE SINGLE
       ===================================================== */

    single() {

        this.singleMode =
            "single";

        return this;

    }


    maybeSingle() {

        this.singleMode =
            "maybeSingle";

        return this;

    }


    /* =====================================================
       INSERT
       ===================================================== */

    insert(
        rows
    ) {

        this.operation =
            "insert";


        this.insertRows =
            Array.isArray(rows)
                ? rows
                : [rows];


        this.returning =
            false;


        this.singleMode =
            null;


        return this;

    }


    /* =====================================================
       UPDATE
       ===================================================== */

    update(
        data
    ) {

        this.operation =
            "update";


        this.updateData =
            data || {};


        this.returning =
            false;


        this.singleMode =
            null;


        return this;

    }


    /* =====================================================
       DELETE
       ===================================================== */

    delete() {

        this.operation =
            "delete";


        this.returning =
            false;


        this.singleMode =
            null;


        return this;

    }


    /* =====================================================
       FILTERS
       ===================================================== */

    eq(
        field,
        value
    ) {

        this.filters.push({
            type:
                "eq",

            field:
                field,

            value:
                value
        });


        return this;

    }


    neq(
        field,
        value
    ) {

        this.filters.push({
            type:
                "neq",

            field:
                field,

            value:
                value
        });


        return this;

    }


    in(
        field,
        values
    ) {

        this.filters.push({
            type:
                "in",

            field:
                field,

            values:
                Array.isArray(values)
                    ? values
                    : []
        });


        return this;

    }


    lt(
        field,
        value
    ) {

        this.filters.push({
            type:
                "lt",

            field:
                field,

            value:
                value
        });


        return this;

    }


    lte(
        field,
        value
    ) {

        this.filters.push({
            type:
                "lte",

            field:
                field,

            value:
                value
        });


        return this;

    }


    gt(
        field,
        value
    ) {

        this.filters.push({
            type:
                "gt",

            field:
                field,

            value:
                value
        });


        return this;

    }


    gte(
        field,
        value
    ) {

        this.filters.push({
            type:
                "gte",

            field:
                field,

            value:
                value
        });


        return this;

    }


    /* =====================================================
       ORDER
       ===================================================== */

    order(
        field,
        options = {}
    ) {

        this.orderByField =
            field;


        this.orderAscending =
            options.ascending !== false;


        return this;

    }


    /* =====================================================
       LIMIT
       ===================================================== */

    limit(
        count
    ) {

        const number =
            Number(count);


        if (
            Number.isFinite(number) &&
            number >= 0
        ) {

            this.limitCount =
                Math.floor(number);

        }


        return this;

    }


    /* =====================================================
       EXECUTE
       ===================================================== */

    async execute() {

        try {

            /*
             * INSERT
             */

            if (
                this.operation ===
                "insert"
            ) {

                const result =
                    await this
                        .executeInsert();


                return this
                    .finalizeResult(
                        result
                    );

            }


            /*
             * SELECT / UPDATE / DELETE
             *
             * Load matching documents first.
             */

            const collection =
                firestore.collection(
                    this.collectionName
                );


            const snapshot =
                await collection.get();


            let rows =
                snapshot.docs.map(
                    doc =>
                        normalizeFirestoreData(
                            doc.data(),
                            doc.id
                        )
                );


            /*
             * Filters
             */

            rows =
                this.applyFilters(
                    rows
                );


            /*
             * ORDER
             */

            if (
                this.orderByField
            ) {

                const field =
                    this.orderByField;


                const direction =
                    this.orderAscending
                        ? 1
                        : -1;


                rows.sort(
                    (
                        a,
                        b
                    ) => {

                        const av =
                            a[field];


                        const bv =
                            b[field];


                        if (
                            av === bv
                        ) {

                            return 0;

                        }


                        if (
                            av === undefined ||
                            av === null
                        ) {

                            return (
                                -1 *
                                direction
                            );

                        }


                        if (
                            bv === undefined ||
                            bv === null
                        ) {

                            return (
                                1 *
                                direction
                            );

                        }


                        if (
                            av < bv
                        ) {

                            return (
                                -1 *
                                direction
                            );

                        }


                        return (
                            1 *
                            direction
                        );

                    }
                );

            }


            /*
             * LIMIT
             */

            if (
                this.limitCount !== null
            ) {

                rows =
                    rows.slice(
                        0,
                        this.limitCount
                    );

            }


            /*
             * SELECT
             */

            if (
                this.operation ===
                "select"
            ) {

                rows =
                    rows.map(
                        row =>
                            projectFields(
                                row,
                                this.selectedFields
                            )
                    );


                return this
                    .finalizeResult({
                        data:
                            rows,

                        error:
                            null
                    });

            }


            /*
             * UPDATE
             */

            if (
                this.operation ===
                "update"
            ) {

                const collectionRef =
                    firestore.collection(
                        this.collectionName
                    );


                const updated =
                    [];


                for (
                    const row
                    of rows
                ) {

                    const updateRef =
                        collectionRef.doc(
                            String(
                                row.id
                            )
                        );


                    await updateRef.set(
                        this.updateData,
                        {
                            merge:
                                true
                        }
                    );


                    const merged =
                        {
                            ...row,
                            ...this.updateData
                        };


                    updated.push(
                        merged
                    );

                }


                /*
                 * Supabase update()
                 * without select()
                 * returns no data.
                 *
                 * update().select()
                 * returns updated rows.
                 */

                const output =
                    this.returning
                        ? updated.map(
                            row =>
                                projectFields(
                                    row,
                                    this.selectedFields
                                )
                        )
                        : null;


                return this
                    .finalizeResult({
                        data:
                            output,

                        error:
                            null
                    });

            }


            /*
             * DELETE
             */

            if (
                this.operation ===
                "delete"
            ) {

                const collectionRef =
                    firestore.collection(
                        this.collectionName
                    );


                const deleted =
                    [];


                for (
                    const row
                    of rows
                ) {

                    await collectionRef
                        .doc(
                            String(
                                row.id
                            )
                        )
                        .delete();


                    deleted.push(
                        row
                    );

                }


                const output =
                    this.returning
                        ? deleted.map(
                            row =>
                                projectFields(
                                    row,
                                    this.selectedFields
                                )
                        )
                        : null;


                return this
                    .finalizeResult({
                        data:
                            output,

                        error:
                            null
                    });

            }


            return this
                .finalizeResult({
                    data:
                        rows,

                    error:
                        null
                });

        }
        catch (error) {

            console.error(
                "[Firestore]",
                error
            );


            return {
                data:
                    null,

                error:
                    error
            };

        }

    }


    /* =====================================================
       INSERT EXECUTION
       ===================================================== */

    async executeInsert() {

        try {

            const collection =
                firestore.collection(
                    this.collectionName
                );


            const inserted =
                [];


            for (
                const original
                of this.insertRows
            ) {

                const row = {
                    ...original
                };


                /*
                 * Generate ID if necessary.
                 */

                if (
                    row.id === undefined ||
                    row.id === null ||
                    row.id === ""
                ) {

                    row.id =
                        generateId();

                }
                else {

                    row.id =
                        String(
                            row.id
                        );

                }


                /*
                 * created_at
                 */

                if (
                    !row.created_at
                ) {

                    row.created_at =
                        new Date()
                            .toISOString();

                }


                /*
                 * Write to Firestore.
                 */

                await collection
                    .doc(
                        String(
                            row.id
                        )
                    )
                    .set(row);


                inserted.push(
                    cloneValue(
                        row
                    )
                );

            }


            /*
             * Supabase insert()
             * normally returns the inserted
             * rows only when .select()
             * is chained.
             *
             * In this project save-item.js
             * uses:
             *
             * insert(...).select()
             *
             * therefore selectedFields is
             * applied here.
             */

            const output =
                inserted.map(
                    row =>
                        projectFields(
                            row,
                            this.selectedFields
                        )
                );


            return {
                data:
                    output,

                error:
                    null
            };

        }
        catch (error) {

            console.error(
                "[Firestore Insert]",
                error
            );


            return {
                data:
                    null,

                error:
                    error
            };

        }

    }


    /* =====================================================
       FILTER ENGINE
       ===================================================== */

    applyFilters(
        rows
    ) {

        let result =
            rows;


        for (
            const filter
            of this.filters
        ) {

            /*
             * EQ
             */

            if (
                filter.type ===
                "eq"
            ) {

                result =
                    result.filter(
                        row =>
                            row[
                                filter.field
                            ] ==
                            filter.value
                    );

            }


            /*
             * NEQ
             */

            if (
                filter.type ===
                "neq"
            ) {

                result =
                    result.filter(
                        row =>
                            row[
                                filter.field
                            ] !=
                            filter.value
                    );

            }


            /*
             * IN
             */

            if (
                filter.type ===
                "in"
            ) {

                result =
                    result.filter(
                        row =>
                            filter.values
                                .some(
                                    value =>
                                        row[
                                            filter.field
                                        ] ==
                                        value
                                )
                    );

            }


            /*
             * LT
             */

            if (
                filter.type ===
                "lt"
            ) {

                result =
                    result.filter(
                        row => {

                            const value =
                                row[
                                    filter.field
                                ];


                            return (
                                value !==
                                    null &&

                                value !==
                                    undefined &&

                                value <
                                    filter.value
                            );

                        }
                    );

            }


            /*
             * LTE
             */

            if (
                filter.type ===
                "lte"
            ) {

                result =
                    result.filter(
                        row => {

                            const value =
                                row[
                                    filter.field
                                ];


                            return (
                                value !==
                                    null &&

                                value !==
                                    undefined &&

                                value <=
                                    filter.value
                            );

                        }
                    );

            }


            /*
             * GT
             */

            if (
                filter.type ===
                "gt"
            ) {

                result =
                    result.filter(
                        row => {

                            const value =
                                row[
                                    filter.field
                                ];


                            return (
                                value !==
                                    null &&

                                value !==
                                    undefined &&

                                value >
                                    filter.value
                            );

                        }
                    );

            }


            /*
             * GTE
             */

            if (
                filter.type ===
                "gte"
            ) {

                result =
                    result.filter(
                        row => {

                            const value =
                                row[
                                    filter.field
                                ];


                            return (
                                value !==
                                    null &&

                                value !==
                                    undefined &&

                                value >=
                                    filter.value
                            );

                        }
                    );

            }

        }


        return result;

    }


    /* =====================================================
       FINALIZE SUPABASE-LIKE RESULT
       ===================================================== */

    finalizeResult(
        result
    ) {

        if (
            result.error
        ) {

            return result;

        }


        if (
            !this.singleMode
        ) {

            return result;

        }


        const data =
            result.data;


        /*
         * INSERT / UPDATE / SELECT
         * may return arrays.
         */

        const arrayData =
            Array.isArray(data)
                ? data
                : [];


        if (
            this.singleMode ===
            "single"
        ) {

            if (
                arrayData.length !== 1
            ) {

                return {
                    data:
                        null,

                    error:
                        new Error(
                            "Expected exactly one row, but received " +
                            arrayData.length
                        )
                };

            }


            return {
                data:
                    arrayData[0],

                error:
                    null
            };

        }


        /*
         * maybeSingle():
         *
         * 0 rows -> null
         * 1 row  -> object
         * >1     -> error
         */

        if (
            this.singleMode ===
            "maybeSingle"
        ) {

            if (
                arrayData.length === 0
            ) {

                return {
                    data:
                        null,

                    error:
                        null
                };

            }


            if (
                arrayData.length > 1
            ) {

                return {
                    data:
                        null,

                    error:
                        new Error(
                            "Expected zero or one row, but received " +
                            arrayData.length
                        )
                };

            }


            return {
                data:
                    arrayData[0],

                error:
                    null
            };

        }


        return result;

    }


    /* =====================================================
       THENABLE
       ===================================================== */

    then(
        resolve,
        reject
    ) {

        return this
            .execute()
            .then(
                resolve,
                reject
            );

    }

}


/* =========================================================
   IMAGEKIT STORAGE
   ========================================================= */

class ImageKitStorage {


    from() {

        return this;

    }


    /* =====================================================
       UPLOAD
       ===================================================== */

    async upload(
        fileName,
        blob
    ) {

        try {

            /*
             * Get temporary ImageKit
             * authentication from Vercel.
             */

            const authResponse =
                await fetch(
                    IMAGEKIT_AUTH_URL
                );


            if (
                !authResponse.ok
            ) {

                throw new Error(
                    "Không lấy được ImageKit authentication."
                );

            }


            const auth =
                await authResponse.json();


            const formData =
                new FormData();


            formData.append(
                "file",
                blob
            );


            formData.append(
                "fileName",
                fileName
            );


            formData.append(
                "publicKey",
                IMAGEKIT_PUBLIC_KEY
            );


            formData.append(
                "signature",
                auth.signature
            );


            formData.append(
                "expire",
                String(
                    auth.expire
                )
            );


            formData.append(
                "token",
                auth.token
            );


            formData.append(
                "folder",
                IMAGEKIT_FOLDER
            );


            formData.append(
                "useUniqueFileName",
                "false"
            );


            /*
             * ImageKit upload.
             */

            const response =
                await fetch(
                    "https://upload.imagekit.io/api/v1/files/upload",
                    {
                        method:
                            "POST",

                        body:
                            formData
                    }
                );


            const result =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    result.message ||
                    "ImageKit upload failed."
                );

            }


            return {
                data: {

                    path:
                        result.filePath,

                    url:
                        result.url,

                    fileId:
                        result.fileId

                },

                error:
                    null
            };

        }
        catch (error) {

            console.error(
                "[ImageKit Upload]",
                error
            );


            return {
                data:
                    null,

                error:
                    error
            };

        }

    }


    /* =====================================================
       PUBLIC URL
       ===================================================== */

    getPublicUrl(
        fileName
    ) {

        const cleanName =
            String(
                fileName
            )
            .replace(
                /^\/+/,
                ""
            );


        return {

            data: {

                publicUrl:
                    IMAGEKIT_URL_ENDPOINT +
                    IMAGEKIT_FOLDER +
                    "/" +
                    cleanName

            }

        };

    }


    /* =====================================================
       DELETE
       ===================================================== */

    async remove(
        paths
    ) {

        try {

            const response =
                await fetch(
                    IMAGEKIT_STORAGE_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "x-app-secret":
                                window
                                    .HOME_AI_APP_SECRET ||
                                ""

                        },

                        body:
                            JSON.stringify({

                                action:
                                    "delete",

                                paths:
                                    Array.isArray(
                                        paths
                                    )
                                        ? paths
                                        : [paths]

                            })

                    }
                );


            const result =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    result.error ||
                    "ImageKit delete failed."
                );

            }


            return {

                data:
                    result,

                error:
                    null

            };

        }
        catch (error) {

            console.error(
                "[ImageKit Delete]",
                error
            );


            return {

                data:
                    null,

                error:
                    error

            };

        }

    }


    /* =====================================================
       LIST
       ===================================================== */

    async list() {

        try {

            const response =
                await fetch(
                    IMAGEKIT_STORAGE_URL +
                    "?action=list",
                    {

                        headers: {

                            "x-app-secret":
                                window
                                    .HOME_AI_APP_SECRET ||
                                ""

                        }

                    }
                );


            const result =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    result.error ||
                    "ImageKit list failed."
                );

            }


            return {

                data:
                    result.files ||
                    [],

                error:
                    null

            };

        }
        catch (error) {

            console.error(
                "[ImageKit List]",
                error
            );


            return {

                data:
                    null,

                error:
                    error

            };

        }

    }

}


/* =========================================================
   HOME AI DATABASE OBJECT
   ========================================================= */

const homeAiDb = {

    from(
        collectionName
    ) {

        return new FirestoreQuery(
            collectionName
        );

    },


    storage:
        new ImageKitStorage()

};


/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.homeAiFirestore =
    firestore;


window.homeAiDb =
    homeAiDb;
