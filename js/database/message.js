// js/database/message.js -> Thông báo Toastify & SweetAlert2

function showMessage(text, type = "info") {

    if (typeof Toastify !== "undefined") {

        let bg = "#1976d2";

        if (type === "success" || text.startsWith("✅") || text.startsWith("♻️")) {

            bg = "#2e7d32";

        } else if (type === "error" || text.startsWith("❌") || text.startsWith("🗑")) {

            bg = "#d32f2f";

        } else if (text.startsWith("🤖") || text.startsWith("⚡")) {

            bg = "#e65100";

        }

        Toastify({
            text: text,
            duration: 3000,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            style: {
                background: bg,
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "bold"
            }
        }).showToast();

        return;

    }

    alert(text);

}

async function asyncConfirm(title, text) {

    if (typeof Swal !== "undefined") {

        const res = await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d32f2f',
            cancelButtonColor: '#757575',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        return res.isConfirmed;

    }

    return confirm(`${title}\n${text}`);

}

async function asyncPrompt(title, defaultValue = "") {

    if (typeof Swal !== "undefined") {

        const { value } = await Swal.fire({
            title: title,
            input: 'text',
            inputValue: defaultValue,
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy'
        });

        return value;

    }

    return prompt(title, defaultValue);

}
