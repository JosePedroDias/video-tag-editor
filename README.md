used ffmpeg to find scene transitions with:

	ffprobe -show_frames -of compact=p=0 -f lavfi "movie=bestOfWeb7.mp4,select=gt(scene\,.4)" > scenes.txt

parsed result (`scenes.txt`) into `sceneTimesOriginal.json` via `parseSceneDetection.js`

made a copy (`sceneTimes.json`) and edited result using `index.html` (which uses `displayScenes.js`, `timelineTweaker` and `chroma.min.js`)
