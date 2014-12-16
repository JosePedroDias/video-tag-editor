sudo apt-get install libtesseract-dev

npm install node-tesseract

ffprobe bestOfWeb7.mp4

ffmpeg -i bestOfWeb7.mp4 -y -f image2 -ss 1 shots/%5d.png

ffprobe -show_frames -of compact=p=0 -f lavfi "movie=bestOfWeb7.mp4,select=gt(scene\,.4)" > scenes.txt


http://superuser.com/questions/819573/split-up-a-video-using-ffmpeg-through-scene-detection

best_effort_timestamp_time=10.802456|

http://videos.sapo.pt/dYMbm0HbaGD1M72IEH1l