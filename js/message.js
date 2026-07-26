function showMessage(text, type = "info") {

    let box =
        document.getElementById(
            "messageBox"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "messageBox";

        box.style.position =
            "fixed";

        box.style.left =
            "12px";

        box.style.right =
            "12px";

        box.style.bottom =
            "12px";

        box.style.zIndex =
            "99999";

        box.style.background =
            "#222";

        box.style.color =
            "#fff";

        box.style.padding =
            "14px";

        box.style.borderRadius =
            "12px";

        box.style.whiteSpace =
            "pre-wrap";

        box.style.wordBreak =
            "break-word";

        box.style.boxShadow =
            "0 4px 16px rgba(0,0,0,.3)";

        document.body.appendChild(
            box
        );

    }


    let color =
        "#1976d2";


    if (type === "success")
        color = "#2e7d32";

    if (type === "error")
        color = "#d32f2f";

    if (
        text.startsWith("❌")
    )
        color = "#d32f2f";

    if (
        text.startsWith("✅")
    )
        color = "#2e7d32";



    box.style.borderLeft =
        "6px solid " +
        color;



    box.innerHTML =

        "<div style='margin-bottom:12px'>" +

        text +

        "</div>" +

        "<button onclick='copyMessage()'>📋 Copy</button> " +

        "<button onclick='closeMessage()'>❌ Đóng</button>";



    window.lastMessage =
        text;

}




function copyMessage() {

    navigator.clipboard.writeText(

        window.lastMessage || ""

    );

}




function closeMessage() {

    const box =
        document.getElementById(
            "messageBox"
        );

    if (box) {

        box.remove();

    }

}
