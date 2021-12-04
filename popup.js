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
                let ffmpegCommand = "ffmpeg -i " + response.playlists + " -c copy video.mp4"
                navigator.clipboard.writeText(ffmpegCommand);
            }
        );
    });
}
function copyFFMPEGAudioExtractCommand() {
    navigator.clipboard.writeText("ffmpeg -i video.mp4 -acodec copy original-audio.aac");
}
function copyFFMPEGCombineCommand() {
    navigator.clipboard.writeText("ffmpeg -i video.mp4 -i audio.mp3 -vcodec copy -acodec copy -map 0:0 -map 1:0 denoised-video.mp4");
}



window.onload = function () {
    document.getElementById("copy-url").onclick = copyUrl;
    document.getElementById("copy-download").onclick = copyFFMPEGDownloadCommand;
    document.getElementById("copy-audio").onclick = copyFFMPEGAudioExtractCommand;
    document.getElementById("copy-combine").onclick = copyFFMPEGCombineCommand;
};

