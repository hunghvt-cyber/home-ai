function initSearch() {

    const search =
        document.getElementById(
            "search"
        );

    if (!search) {

        return;

    }

    search.addEventListener(

        "input",

        function() {

            const items =
                filterItems(
                    search.value
                );

            renderItems(items);

        }

    );

}