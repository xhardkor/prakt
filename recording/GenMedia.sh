#!/bin/bash

DIR=$(dirname "$0")
MEDDIR="$DIR/mediamtx.yml"
CAMCONF="$DIR/.conf"

cat > $MEDDIR <<'EOF'
paths:
EOF

while read -r camera ip; do
  echo "$camera -> $ip"
    [[ -z "$camera" || -z "$ip" || "$camera" == \#* ]] && continue

    cat >> $MEDDIR <<EOF
  $camera:
    source: rtsp://$ip:8554/h264.sdp
EOF
done < $CAMCONF

cat >> $MEDDIR <<'EOF'

hls: true
hlsAddress: :8888
hlsSegmentDuration: 1s
hlsSegmentCount: 300

webrtc: true
webrtcAddress: :8889
webrtcLocalUDPAddress: :8189

rtmp: false
EOF
