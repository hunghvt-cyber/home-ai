import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function adminAuth() {
    if (!getApps().length) {
        const serviceAccount =
            JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT_JSON || ""
            );

        initializeApp({
            credential:
                cert(serviceAccount)
        });
    }

    return getAuth();
}

export async function requireFirebaseUser(
    req,
    res
) {
    const authorization =
        String(
            req.headers.authorization ||
            ""
        );

    if (!authorization.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Unauthorized"
        });

        return null;
    }

    try {
        return await adminAuth().verifyIdToken(
            authorization.slice(7),
            true
        );
    }
    catch (error) {
        console.warn(
            "Firebase token rejected:",
            error.message
        );

        res.status(401).json({
            error: "Unauthorized"
        });

        return null;
    }
}
