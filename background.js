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

        if (!("initiator" in details)) {
            return;
        }

        if (!details.initiator.endsWith(PANOPTO_HOSTNAME_SUFFIX)) {
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

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when a page's URL is from Panopto ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostSuffix: PANOPTO_HOSTNAME_SUFFIX },
                    })
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});
