// js/search/search.js

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
