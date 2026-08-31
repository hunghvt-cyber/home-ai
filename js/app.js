function showError(error) {

    const message =
        document.getElementById(
            "message"
        );

    if (!message) {
        return;
    }

    message.innerHTML =
        "❌ " +
        (
            typeof escapeHtml === "function"
                ? escapeHtml(error.message || error)
                : (error.message || error)
        );

    message.style.color =
        "red";

}

window.onerror =
    function (
        message,
        source,
        line,
        column,
        error
    ) {

        showError({

            message:
                message +
                " (" +
                line +
                ":" +
                column +
                ")"

        });

    };

window.addEventListener(

    "unhandledrejection",

    function (event) {

        showError({

            message:
                event.reason

        });

    }

);

async function init() {

    try {

        if (typeof initAuth === "function") {
            const allowed = await initAuth();

            if (!allowed) {
                return;
            }
        }

        if (typeof initImage === "function") {
            initImage();
        }

        if (typeof initSearch === "function") {
            initSearch();
        }

        if (typeof initAI === "function") {
            initAI();
        }

        if (typeof loadRooms === "function") {
            await loadRooms();
        }

        if (typeof loadItems === "function") {
            await loadItems();
        }

        if (typeof renderRoomStats === "function") {
            renderRoomStats();
        }

    }
    catch (error) {

        showError(error);

    }

}

document.addEventListener(
    "DOMContentLoaded",
    init
);