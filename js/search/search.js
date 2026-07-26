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

            function() {


                const items =
                    filterItems(
                        search.value
                    );


                renderItems(items);


            }

        );


    }



    if (roomFilter) {


        roomFilter.addEventListener(

            "change",

            function() {


                const items =
                    filterItems(
                        search
                            ? search.value
                            : ""
                    );


                renderItems(items);


            }

        );


    }


}