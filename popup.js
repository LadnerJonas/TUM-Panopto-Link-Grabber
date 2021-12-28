function copyUrl() {
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(function (tabs) {
        chrome.runtime.sendMessage(
            { tabId: tabs[0].id },
            function (response) {
                if (!("playlists" in response)) {
                    return;
                }
                navigator.clipboard.writeText(response.playlists);
            }
        );
    });
}

function copyFFMPEGDownloadCommand() {

    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(function (tabs) {
        chrome.runtime.sendMessage(
            { tabId: tabs[0].id },
            function (response) {
                if (!("playlists" in response)) {
                    return;
                }
                let ffmpegCommand = "ffmpeg -i " + response.playlists + " -c copy video.mp4 && ffmpeg -i video.mp4 -acodec copy audio.aac"
                navigator.clipboard.writeText(ffmpegCommand);
            }
        );
    });
}
function copyFFMPEGCombineCommand() {
    navigator.clipboard.writeText("ffmpeg -i video.mp4 -i audio.mp3 -vcodec copy -acodec copy -map 0:0 -map 1:0 video-improved.mp4");
}

window.onload = function () {
    document.getElementById("copy-url").onclick = copyUrl;
    document.getElementById("copy-download-and-audio-extract").onclick = copyFFMPEGDownloadCommand;
    document.getElementById("copy-combine").onclick = copyFFMPEGCombineCommand;
};

