function copyStreams() {
    chrome.tabs.getSelected(function (tab) {
        chrome.runtime.sendMessage(
            { tabId: tab.id },
            function (response) {
                if (!("playlists" in response)) {
                    return;
                }

                navigator.clipboard.writeText(response.playlists.join("\n"));
            }
        );
    });
}

/**
 * @param {HTMLOListElement | HTMLUListElement} list List to append to
 * @param {string[]} urls URLs of m3u8 video streams
 */
function buildListOfStreams(list, urls) {
    for (let index = 0; index < urls.length; ++index) {
        const link = document.createElement("a");
        link.href = urls[index];
        link.text = `Stream ${index + 1}`;

        const listItem = document.createElement("li");
        listItem.appendChild(link);

        if (Hls.isSupported()) {
            const video = document.createElement("video");
            const hls = new Hls();
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                hls.loadSource(link.href);
            });
            video.controls = true;
            listItem.appendChild(video);
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (xhr.status != 200) {
                return;
            }

            const resolutionRegex = /RESOLUTION=(\d+x\d+)/m;
            const match = resolutionRegex.exec(xhr.responseText);
            if (null != match) {
                const resolution = match[1];
                const text = document.createTextNode(` (${resolution})`);
                listItem.appendChild(text);
            }
        };
        xhr.open("GET", urls[index]);
        xhr.send();

        list.appendChild(listItem);
    }
}

window.onload = function () {
    document.getElementById("copy").onclick = copyStreams;

    chrome.tabs.getSelected(function (tab) {
        chrome.tabs.sendMessage(tab.id, "comments", function (response) {
            const commentsArea = document.getElementById("comments");
            commentsArea.textContent = "";
            for (comment of response) {
                commentsArea.textContent += `${comment.time} - ${comment.userName} - ${comment.comment}\n`;
            }
        });

        chrome.tabs.sendMessage(tab.id, "podcast", function (response) {
            if (!response) {
                return;
            }

            buildListOfStreams(
                document.getElementById("podcast"),
                response.Delivery.PodcastStreams.map(stream => stream.StreamUrl)
            );
        });

        chrome.runtime.sendMessage(
            { tabId: tab.id },
            function (response) {
                if (!("playlists" in response)) {
                    return;
                }

                buildListOfStreams(document.getElementById("links"), response.playlists);
            }
        );
    });
};
