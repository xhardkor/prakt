#!/bin/bash
printf "SCRIPT PID: $$"

RDIR=$(dirname "$0")
CDIR="$RDIR/.conf"

echo $CDIR

mapfile -t CAMERAS < $CDIR
PIDS=()

run_camera() {
  local URL=$1
  local NAME=$2

  while true; do
    DIR="$RDIR/out/$NAME/$(date +%F)"
    mkdir -p $DIR
    START=$(date +%s)

    ffmpeg -rtsp_transport tcp \
    -i "$URL$NAME" \
    -c:v copy \
    -f segment \
    -segment_time 60 \
    -reset_timestamps 1 \
    -movflags +faststart \
    "$DIR/cam_${START}_%03d.mp4"

    EXIT_CODE=$?
    printf "$NAME[$!] FFMPEG exited with code $EXIT_CODE"
    sleep 2
  done
}

cleanup() {
  for pid in ${PIDS[@]}; do
    printf "\n KILLING PID: $pid"
    kill "$pid" 2>/dev/null
  done
  printf "\nDone"
  wait
  exit 0
}

trap cleanup SIGTERM SIGINT SIGKILL

LOCALURL="rtsp://localhost:8554/"
while read -r camera ip; do
  [[ -z "$camera" || -z "$ip" || "$camera" == \#* ]] && continue
  run_camera "$LOCALURL" "$camera" &
  PIDS+=($!)
done < $CDIR

wait
