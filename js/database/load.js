async function loadItems() {


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



    renderItems();



    renderRoomStats();


}
