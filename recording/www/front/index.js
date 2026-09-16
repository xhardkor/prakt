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

async function loadCameras() {
  try {
    const resp = await fetch("/cameras")
    if(!resp.ok) {
      throw new Error(`HTTP response ${resp.status}`)
    }

    const cameras = await resp.json()

    const start = document.querySelector(".start");

    let index = 0
    for(const[camera, _] of Object.entries(cameras)){
      let URL = `http://localhost:8888/${camera}/index.m3u8`
      ++index

      const container = document.createElement("div");

      container.className = "video-container";
      container.id = `video${index}`;

      const video = document.createElement("video");

      video.controls = true;
      video.autoplay = true;
      video.height = 600;
      video.width = 800;

      const button = document.createElement("button");

      button.textContent = "LIVE";
      button.onclick = liveButton;

      container.appendChild(video);
      container.appendChild(button);

      start.appendChild(container);

      startStream(container.id, URL);
    }
  } catch(err) {
    console.error("Failed Load Cameras: ", err)
  }
}

loadCameras()
