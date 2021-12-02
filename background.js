const PANOPTO_HOSTNAME_SUFFIX = ".panopto.eu";

var PLAYLISTS = {};

chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (details.tabId == -1) {
            return;
        }

        if (details.statusCode != 200) {
            return;
        }

        let origin = null;
        if (details.initiator) {
            origin = details.initiator;
        } else if (details.originUrl) {
            origin = new URL(details.originUrl).hostname;
        } else {
            return;
        }

        if (!origin.endsWith(PANOPTO_HOSTNAME_SUFFIX)) {
            return;
        }

        const url = new URL(details.url);

        if (!url.pathname.endsWith("/master.m3u8")) {
            return;
        }

        if (!(details.tabId in PLAYLISTS)) {
            PLAYLISTS[details.tabId] = [];
        }
        PLAYLISTS[details.tabId].push(url.href);
    },
    // filters
    {
        urls: ["*://*/*"]
    }
);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!("url" in changeInfo)) {
        return;
    }

    const url = new URL(changeInfo.url);

    // If we're navigating away from Panopto, clear the cache of playlists.
    // TODO: detect actual URL change, not just a hostname.
    if (!url.hostname.endsWith(PANOPTO_HOSTNAME_SUFFIX)) {
        delete PLAYLISTS[tabId];
    }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    delete PLAYLISTS[tabId];
});

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.tabId in PLAYLISTS) {
            sendResponse({ playlists: PLAYLISTS[message.tabId] });
        } else {
            sendResponse({});
        }
    }
);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        if ((new URL(tab.url)).hostname.endsWith(PANOPTO_HOSTNAME_SUFFIX)) {
            chrome.pageAction.show(tabId);
        } else {
            chrome.pageAction.hide(tabId);
        }
    }
})
