function showMessage(message) {

    const box =
        document.getElementById("message");

    if (!box) {

        return;

    }

    box.innerHTML = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

        box.innerHTML = "";

    }, 2500);

}