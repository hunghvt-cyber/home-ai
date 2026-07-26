const check =
    await db
        .from("items")
        .select("id")
        .eq(
            "room",
            room.name
        );


if (check.error) {

    showMessage(
        "❌ " +
        check.error.message
    );

    return;

}


if (
    check.data &&
    check.data.length > 0
) {

    showMessage(
        "❌ Không thể xóa. Phòng này còn " +
        check.data.length +
        " món đồ."
    );

    return;

}
