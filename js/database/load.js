async function loadItems() {

    if (
        typeof runTrashAutoClean === "function"
    ) {

        await runTrashAutoClean();

    }


    const result =
        await db
            .from("items")
            .select("*")
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (result.error) {

        showMessage(
            "❌ " +
            result.error.message
        );

        return;

    }


    allItems =
        result.data || [];


    const extraImagesMap =
        await loadAllExtraImagesMap();

    allItems.forEach(function(item) {

        item.extraImages =
            extraImagesMap[item.id] || [];

    });


    renderItems();


    if (
        typeof renderRoomStats === "function"
    ) {

        renderRoomStats();

    }

}
