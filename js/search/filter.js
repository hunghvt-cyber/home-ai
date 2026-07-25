function filterItems(keyword) {

    keyword =
        keyword
            .trim()
            .toLowerCase();

    if (keyword === "") {

        return allItems;

    }

    return allItems.filter(item => {

        const name =
            (item.name || "")
                .toLowerCase();

        const location =
            (item.location || "")
                .toLowerCase();

        return (
            name.includes(keyword) ||
            location.includes(keyword)
        );

    });

}