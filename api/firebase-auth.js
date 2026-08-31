import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

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
        const decoded =
            await adminAuth().verifyIdToken(
                authorization.slice(7),
                true
            );

        const email =
            String(
                decoded.email || ""
            )
                .trim()
                .toLowerCase();

        const member =
            await getFirestore()
                .collection(
                    "access_users"
                )
                .doc(
                    email
                )
                .get();

        if (
            !member.exists ||
            member.data().active !== true
        ) {

            throw new Error(
                "Account is not allowed"
            );

        }

        return decoded;
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
