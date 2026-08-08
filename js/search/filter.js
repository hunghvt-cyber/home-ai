function filterItems(keyword) {


    keyword =
        keyword
            .trim()
            .toLowerCase();



    const roomFilter =
        document
            .getElementById("roomFilter")
            ?.value || "";



    return allItems.filter(item => {



        const name =
            (item.name || "")
            .toLowerCase();



        const location =
            (item.location || "")
            .toLowerCase();



        const room =
            (item.room || "")
            .toLowerCase();



        const tags =
            Array.isArray(item.tags)

                ? item.tags
                    .join(" ")
                    .toLowerCase()

                : "";



        const matchKeyword =
            keyword === "" ||

            name.includes(keyword) ||

            location.includes(keyword) ||

            room.includes(keyword) ||

            tags.includes(keyword);



        const matchRoom =
            roomFilter === ""
                ? item.room !== TRASH_ROOM_NAME
                : item.room === roomFilter;



        return (
            matchKeyword &&
            matchRoom
        );


    });


}
