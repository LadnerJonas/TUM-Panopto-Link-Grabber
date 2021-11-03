let megaJson = null;

function issueMegaJsonRequest() {
    const id = new URL(window.location.href).searchParams.get("id");
    if (!id) {
        console.log("Weird Panopto URL, can't get ID");
        return;
    }

    const request = new XMLHttpRequest();
    request.addEventListener("load", function () {
        megaJson = JSON.parse(request.response);
    });
    request.open("POST", "/Panopto/Pages/Viewer/DeliveryInfo.aspx");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(`deliveryId=${id}&responseType=json`);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message !== "podcast") {
        return;
    }

    sendResponse(megaJson);
});

issueMegaJsonRequest();
