# TUM Panopto Link Grabber

A browser extension used to grab links to download and improve audio quality of videos published on TUM's Panopto server.

## Usage

1. Open a TUM Panopto page
2. Let the video play for a couple of seconds
3. Open the extension popup

<p align="center"><img src="https://user-images.githubusercontent.com/92096842/147611827-1e7f0b32-8d6e-4621-9277-525b1301c2fc.png"/></p>

4. Click on the *Copy ffmpeg download command* button (This copies the command to your clipboard)
5. Open a terminal in your preferred download location
6. Paste the copied command
7. Wait until the video is downloaded and the audio is extracted
8. Open the extracted audio in [Audacity](https://www.audacity.de/)
9. Select a few seconds of audio with background noises

<p align="center"><img src="https://user-images.githubusercontent.com/92096842/147611388-8cf57263-02f1-4495-8310-7bedfb79e99c.png"/></p>

10. Click on Effect -> Noise Removal -> Get Noise Profile

<p align="center"><img src="https://user-images.githubusercontent.com/92096842/147611505-85ff9e86-2342-42b0-820d-964bd8082399.png"/></p>

11. Select the whole audio via ```STRG+A```
12. Apply the effect on the whole audio via ```STRG+R```
13. Export the improved audio as .mp3 in the same folder as the downloaded video
14. Click on the *Copy combine command* button in your browser
15. Paste the copied command into the previous terminal
16. Enjoy the improved video

## Installation

Dependencies:
- [FFmpeg](https://ffmpeg.org/)
- [Audacity](https://www.audacity.de/)


### Chrome

1. Clone the Repository.
2. Go to your `chrome://extensions/`
3. Activate *Developer Mode*
4. Load unpacked
5. Select the repository directory

### Firefox

1. Currently unsupported

## Shoutout to the upstream repository 🏅
[mbikovitsky/panopto-m3u8](https://github.com/mbikovitsky/panopto-m3u8)

[source](https://github.com/mbikovitsky/panopto-m3u8/releases/latest)

[firefox-release](https://github.com/mbikovitsky/panopto-m3u8/releases/latest/download/panopto_m3u8_finder.xpi)
