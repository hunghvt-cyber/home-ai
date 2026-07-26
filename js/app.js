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
        error.message;

    message.style.color =
        "red";

}


window.onerror =
    function(
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

    function(event) {

        showError({

            message:
                event.reason

        });

    }

);


function init() {

    try {

        initImage();

        initSearch();

        initAI();

        loadItems();

    }
    catch(error) {

        showError(error);

    }

}


document.addEventListener(

    "DOMContentLoaded",

    init

);