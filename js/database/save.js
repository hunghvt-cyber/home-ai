// js/database/save.js
// File "keo dán" cuối cùng: gọi các hàm nhỏ ở save-utils.js,
// save-item.js, image-upload.js, form.js để hoàn tất luồng Lưu.


async function saveItem() {

    if (isSaving) {

        return;

    }



    const data =
        getFormData();



    if (data.name === "") {

        showMessage(
            "❌ Nhập tên đồ."
        );

        return;

    }



    if (
        !editingItem &&
        !selectedFile
    ) {

        showMessage(
            "❌ Vui lòng chọn ảnh."
        );

        return;

    }



    const saveButton =
        document.getElementById(
            "saveButton"
        );

    showSaving(saveButton);



    try {


        if (editingItem) {

            await updateItem(data);

            clearForm();

            showMessage(
                "✅ Đã cập nhật."
            );

            await loadItems();

        }
        else {

            const imageUrl =
                await uploadImage(
                    selectedFile
                );

            await insertItem({

                ...data,

                image_url:
                    imageUrl

            });

            clearForm();

            showMessage(
                "✅ Đã lưu. Chụp món tiếp theo..."
            );

            await loadItems();



            // Continuous Scan: tự động mở camera cho món tiếp theo
            openCamera();

        }

    }
    catch (error) {

        showMessage(
            "❌ " +
            error.message
        );

    }
    finally {

        hideSaving(saveButton);

    }

}



// Bỏ qua món đang chụp dở (chưa lưu), quay lại camera để chụp món tiếp theo.
// Nếu đang sửa 1 món đã lưu trước đó thì coi như Hủy sửa.
function skipItem() {

    if (editingItem) {

        cancelEdit();

        return;

    }

    clearForm();

    showMessage(
        "⏭️ Đã bỏ qua, chụp món tiếp theo..."
    );

    openCamera();

}