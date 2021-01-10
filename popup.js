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

window.onload = function () {
    document.getElementById("copy").onclick = copyStreams;

    chrome.tabs.getSelected(function (tab) {
        chrome.runtime.sendMessage(
            { tabId: tab.id },
            function (response) {
                if (!("playlists" in response)) {
                    return;
                }

                const links = document.getElementById("links");

                for (let index = 0; index < response.playlists.length; ++index) {
                    const link = document.createElement("a");
                    link.href = response.playlists[index];
                    link.text = `Stream ${index + 1}`;

                    const listItem = document.createElement("li");
                    listItem.appendChild(link);

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
                    xhr.open("GET", response.playlists[index]);
                    xhr.send();

                    links.appendChild(listItem);
                }
            }
        );
    });
};
