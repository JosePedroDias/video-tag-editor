### recipe for video scene detection w/ web interface for tweaking cuts

used ffmpeg to find scene transitions with:

	ffprobe -show_frames -of compact=p=0 -f lavfi "movie=bestOfWeb7.mp4,select=gt(scene\,.4)" > scenes.txt

parsed result (`scenes.txt`) into `sceneTimesOriginal.json` via `parseSceneDetection.js`

made a copy (`sceneTimes.json`) and edited result using `index.html` (which uses `displayScenes.js`, `timelineTweaker` and `chroma.min.js`)

The example for tag editing is this awesome video [Best of Web 7 by Zapatou](https://www.youtube.com/watch?v=axgDgH6f7Pw)
