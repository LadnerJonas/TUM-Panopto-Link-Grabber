chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message !== "comments") {
        return;
    }

    const comments = []
    for (row of document.querySelectorAll("div.comment-row")) {
        const userName = row.querySelector("div.user-name").textContent;
        const time = row.querySelector("div.content-row-time").textContent;
        const comment = row.querySelector("div.comment-text").textContent;
        comments.push({ userName: userName, time: time, comment: comment });
    }

    sendResponse(comments);
});
