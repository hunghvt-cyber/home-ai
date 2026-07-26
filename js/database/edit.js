let editingItem = null;



function editItem(id) {


    const item =
        allItems.find(
            x => x.id == id
        );



    if (!item) {


        showMessage(
            "❌ Không tìm thấy dữ liệu."
        );


        return;

    }



    editingItem = item;



    document
        .getElementById("name")
        .value =
        item.name || "";



    document
        .getElementById("location")
        .value =
        item.location || "";



    const room =
        document.getElementById(
            "room"
        );



    if (room) {


        room.value =
            item.room || "";


    }



    const preview =
        document.getElementById(
            "preview"
        );



    if (preview) {


        preview.src =
            item.image_url || "";


        preview.style.display =
            item.image_url
                ? "block"
                : "none";


    }



    document
        .getElementById(
            "selectedImage"
        )
        .innerHTML =
        "Ảnh hiện tại";



    document
        .getElementById(
            "saveButton"
        )
        .innerHTML =
        "💾 Cập nhật";



    document
        .getElementById(
            "cancelButton"
        )
        .style.display =
        "inline-block";



    window.scrollTo({

        top:0,

        behavior:"smooth"

    });



    showMessage(
        "✏️ Đang chỉnh sửa."
    );


}





function cancelEdit() {


    editingItem = null;


    clearForm();



    const saveButton =
        document.getElementById(
            "saveButton"
        );


    if (saveButton) {


        saveButton.innerHTML =
            "💾 Lưu";


    }



    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    if (cancelButton) {


        cancelButton.style.display =
            "none";


    }



    showMessage(
        "✅ Đã hủy chỉnh sửa."
    );


}
