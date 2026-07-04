#!/bin/bash
printf "SCRIPT PID: $$"

CAMERAS=(
  "cam1"
  "cam2"
  "cam3"
)
PIDS=()

run_camera() {
  local URL=$1
  local NAME=$2

  while true; do
    DIR="$(pwd)/out/$NAME/$(date +%F)"
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
for index in ${!CAMERAS[@]}; do
  NAME="${CAMERAS[index]}"
  run_camera "$LOCALURL" "$NAME" &
  PIDS+=($!)
done

wait
