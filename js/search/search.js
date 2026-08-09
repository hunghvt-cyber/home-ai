// js/search/search.js

let html5QrCodeScanner = null;

function debounce(func, delay = 250) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout = setTimeout(
            () => func.apply(this, args),
            delay
        );

    };

}

function initSearch() {

    const search =
        document.getElementById(
            "search"
        );

    const roomFilter =
        document.getElementById(
            "roomFilter"
        );

    if (search) {

        search.addEventListener(
            "input",
            debounce(function () {

                const items =
                    filterItems(
                        search.value
                    );

                renderItems(items);

            }, 250)
        );

    }

    if (roomFilter) {

        roomFilter.addEventListener(
            "change",
            function () {

                const items =
                    filterItems(
                        search
                            ? search.value
                            : ""
                    );

                renderItems(items);

                if (
                    typeof updateEmptyTrashButtonVisibility === "function"
                ) {

                    updateEmptyTrashButtonVisibility();

                }

            }
        );

    }

}

function startQRScanner() {

    const modal =
        document.getElementById("qrModal");

    if (modal) {

        modal.style.display = "flex";

    }

    if (typeof Html5Qrcode !== "undefined") {

        if (!html5QrCodeScanner) {

            html5QrCodeScanner = new Html5Qrcode("qrReader");

        }

        html5QrCodeScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 220, height: 220 }
            },
            (decodedText) => {

                const searchInput = document.getElementById("search");

                if (searchInput) {

                    searchInput.value = decodedText;

                    const items = filterItems(decodedText);

                    renderItems(items);

                }

                stopQRScanner();

                showMessage("📷 Đã quét: " + decodedText);

            },

            (errorMessage) => {

                // Đang quét ngầm

            }
        ).catch(err => {

            showMessage("❌ Không mở được camera: " + err, "error");

            stopQRScanner();

        });

    }

}

function stopQRScanner() {

    const modal = document.getElementById("qrModal");

    if (modal) {

        modal.style.display = "none";

    }

    if (html5QrCodeScanner) {

        html5QrCodeScanner.stop().catch(err => console.warn(err));

    }

}
