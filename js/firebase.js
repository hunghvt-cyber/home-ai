// js/firebase.js
// Firestore + ImageKit compatibility adapter for Home AI
//
// Mục tiêu:
// - Giữ nguyên toàn bộ code hiện tại đang gọi db.from(...)
// - Thay Supabase Database bằng Firestore
// - Thay Supabase Storage bằng ImageKit
//
// Không chứa ImageKit Private Key.

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
   FIREBASE INITIALIZATION
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
        fields.trim() === "*"
    ) {

        return row;

    }

    const names =
        fields
            .split(",")
            .map(
                x => x.trim()
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
   FIRESTORE QUERY COMPATIBILITY
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

    }


    select(
        fields = "*"
    ) {

        this.selectedFields =
            fields;

        if (
            this.operation ===
            "insert"
        ) {

            return this;

        }

        this.operation =
            "select";

        return this;

    }


    insert(
        rows
    ) {

        this.operation =
            "insert";

        this.insertRows =
            Array.isArray(rows)
                ? rows
                : [rows];

        return this;

    }


    update(
        data
    ) {

        this.operation =
            "update";

        this.updateData =
            data || {};

        return this;

    }


    delete() {

        this.operation =
            "delete";

        return this;

    }


    eq(
        field,
        value
    ) {

        this.filters.push({
            type: "eq",
            field,
            value
        });

        return this;

    }


    in(
        field,
        values
    ) {

        this.filters.push({
            type: "in",
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
            type: "lt",
            field,
            value
        });

        return this;

    }


    order(
        field,
        options = {}
    ) {

        this.orderByField =
            field;

        this.orderAscending =
            options.ascending !==
            false;

        return this;

    }


    async execute() {

        try {

            if (
                this.operation ===
                "insert"
            ) {

                return await this
                    .executeInsert();

            }

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


            rows =
                this.applyFilters(
                    rows
                );


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
                            av ===
                            undefined ||
                            av === null
                        ) {

                            return -1 *
                                direction;

                        }

                        if (
                            bv ===
                            undefined ||
                            bv === null
                        ) {

                            return 1 *
                                direction;

                        }

                        if (
                            av < bv
                        ) {

                            return -1 *
                                direction;

                        }

                        return 1 *
                            direction;

                    }
                );

            }


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

                return {
                    data: rows,
                    error: null
                };

            }


            if (
                this.operation ===
                "update"
            ) {

                const collectionRef =
                    firestore.collection(
                        this.collectionName
                    );

                for (
                    const row
                    of rows
                ) {

                    const id =
                        String(
                            row.id
                        );

                    await collectionRef
                        .doc(id)
                        .set(
                            this.updateData,
                            {
                                merge: true
                            }
                        );

                }

                return {
                    data: null,
                    error: null
                };

            }


            if (
                this.operation ===
                "delete"
            ) {

                const collectionRef =
                    firestore.collection(
                        this.collectionName
                    );

                for (
                    const row
                    of rows
                ) {

                    const id =
                        String(
                            row.id
                        );

                    await collectionRef
                        .doc(id)
                        .delete();

                }

                return {
                    data: null,
                    error: null
                };

            }


            return {
                data: rows,
                error: null
            };

        }
        catch (error) {

            console.error(
                "[Firestore]",
                error
            );

            return {
                data: null,
                error
            };

        }

    }


    async executeInsert() {

        try {

            const collection =
                firestore.collection(
                    this.collectionName
                );

            const inserted = [];


            for (
                const original
                of this.insertRows
            ) {

                const row =
                    {
                        ...original
                    };

                if (
                    row.id ===
                    undefined ||
                    row.id ===
                    null ||
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


                if (
                    !row.created_at
                ) {

                    row.created_at =
                        new Date()
                            .toISOString();

                }


                await collection
                    .doc(
                        String(row.id)
                    )
                    .set(row);


                inserted.push(
                    cloneValue(row)
                );

            }


            const data =
                inserted.map(
                    row =>
                        projectFields(
                            row,
                            this.selectedFields
                        )
                );


            return {
                data,
                error: null
            };

        }
        catch (error) {

            console.error(
                "[Firestore Insert]",
                error
            );

            return {
                data: null,
                error
            };

        }

    }


    applyFilters(
        rows
    ) {

        let result =
            rows;


        for (
            const filter
            of this.filters
        ) {

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


            if (
                filter.type ===
                "lt"
            ) {

                result =
                    result.filter(
                        row =>
                            row[
                                filter.field
                            ] !==
                            null &&
                            row[
                                filter.field
                            ] !==
                            undefined &&
                            row[
                                filter.field
                            ] <
                            filter.value
                    );

            }

        }


        return result;

    }


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
   IMAGEKIT STORAGE COMPATIBILITY
   ========================================================= */

class ImageKitStorage {

    constructor() {

        this.bucket =
            "images";

    }


    from() {

        return this;

    }


    async upload(
        fileName,
        blob,
        options = {}
    ) {

        try {

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

            formData.append(
                "overwriteFile",
                "false"
            );


            const response =
                await fetch(
                    "https://upload.imagekit.io/api/v1/files/upload",
                    {
                        method: "POST",
                        body: formData
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

                error: null
            };

        }
        catch (error) {

            console.error(
                "[ImageKit Upload]",
                error
            );

            return {
                data: null,
                error
            };

        }

    }


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


    async remove(
        paths
    ) {

        try {

            const response =
                await fetch(
                    IMAGEKIT_STORAGE_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "x-app-secret":
                                getHomeAiAppSecret()
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
                                        : [
                                            paths
                                        ]
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
                data: null,
                error
            };

        }

    }


    async list(
        path = "",
        options = {}
    ) {

        try {

            const response =
                await fetch(
                    IMAGEKIT_STORAGE_URL +
                    "?action=list",

                    {
                        method: "GET",

                        headers: {
                            "x-app-secret":
                                getHomeAiAppSecret()
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
                    result.files || [],

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
                data: null,
                error
            };

        }

    }

}


function getHomeAiAppSecret() {

    return (
        window.HOME_AI_APP_SECRET ||
        ""
    );

}


/* =========================================================
   PUBLIC DB OBJECT
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


window.homeAiFirestore =
    firestore;

window.homeAiDb =
    homeAiDb;
