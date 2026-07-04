```bash
#MediaMTX server with yaml file:
# idk if needed: -e MTX_RTSPTRANSPORTS=tcp 

# HLS 8888
# WebRTC 8189 and 8889
# RTSP 8554

#open
http://<win-ip>:8889/test
file://wsl.localhost/Ubuntu/home/nuja/praktika/1rnd/www/index.html

docker run --rm -it \
-p 8189:8189/udp \
-p 8889:8889/tcp \
-p 8554:8554 \
-p 8888:8888 \
-v $(pwd)/mediamtx.yml:/mediamtx.yml \
bluenviron/mediamtx

#-g 25 -keyint_min 25 \
#-c:a aac \ <- audio
# ONLY FOR TESTS
ffmpeg \
-re -stream_loop -1 -i test.mp4 \
-re -stream_loop -1 -i test2.mp4 \
\
-map 0:v -an \
-c:v libx264 -preset veryfast -tune zerolatency \
-profile:v baseline -pix_fmt yuv420p \
-f rtsp -rtsp_transport tcp rtsp://localhost:8554/test \
\
-map 1:v -an \
-c:v libx264 -preset veryfast -tune zerolatency \
-profile:v baseline -pix_fmt yuv420p \
-f rtsp -rtsp_transport tcp rtsp://localhost:8554/test2 \
\


# with audio
ffmpeg \
-re -stream_loop -1 -i test.mp4 \
-re -stream_loop -1 -i test2.mp4 \
\
-map 0:v \
-c:v libx264 -pix_fmt yuv420p -preset ultrafast -b:v 600k \
-c:a libopus -b:a 64K -async 50 \
-f rtsp -rtsp_transport tcp rtsp://localhost:8554/test
\
-map 1:v \
-c:v libx264 -pix_fmt yuv420p -preset ultrafast -b:v 600k \
-c:a libopus -b:a 64K -async 50 \
-f rtsp -rtsp_transport tcp rtsp://localhost:8554/test2

# MAKE SHURE THAT WEBRTC IS ENABLED IN BROWSER!

#show in video player
ffplay -rtsp_transport tcp rtsp://localhost:8554/test

# JUST IN CASE
# if we need to give ports for Windows:
netsh advfirewall firewall add rule name="Open UDP Port 8189" dir=in action=allow protocol=UDP localport=8189
netsh advfirewall firewall add rule name="Open TCP Port 8889" dir=in action=allow protocol=TCP localport=8889

# Deleting ports:
netsh advfirewall firewall delete rule name="Open UDP Port 8189"
netsh advfirewall firewall delete rule name="Open TCP Port 8889"

# Checking if ports exists:
Get-NetFirewallPortFilter | Where-Object {$_.LocalPort -eq "8889"}
```
