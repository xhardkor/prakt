const players = new Set();

function startStream(videoElementID, streamURL) {
  if (!Hls.isSupported()) {
    console.error("HLS not supported");
    return;
  }

  const container = document.getElementById(videoElementID);
  const video = container.querySelector("video");

  const hls = new Hls();
  video._hls = hls;

  players.add({ video, hls });

  hls.loadSource(streamURL);
  hls.attachMedia(video);
}


function liveButton(event) {
  const container = event.currentTarget.closest('div');
  const video = container.querySelector('video');

  const hls = video._hls;
  if (!hls || hls.liveSyncPosition == null) return;

  video.currentTime = hls.liveSyncPosition;
}

function liveAll() {
  players.forEach(({ video, hls }) => {
    if (!hls || hls.liveSyncPosition == null) return;

    try {
      video.currentTime = hls.liveSyncPosition;
    } catch (e) {
      console.warn('Failed to sync video:', e);
    }
  });
}

startStream('video0', 'http://localhost:8888/cam1/index.m3u8');
startStream('video1', 'http://localhost:8888/cam2/index.m3u8');
startStream('video2', 'http://localhost:8888/cam3/index.m3u8');
