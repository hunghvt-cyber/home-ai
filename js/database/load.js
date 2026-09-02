async function loadItems() {

    if (
        typeof runTrashAutoClean === "function"
    ) {

        const lastCleanTime = localStorage.getItem("lastTrashAutoClean");
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (!lastCleanTime || (now - parseInt(lastCleanTime) > twentyFourHours)) {
            await runTrashAutoClean();
            localStorage.setItem("lastTrashAutoClean", now.toString());
        }

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
