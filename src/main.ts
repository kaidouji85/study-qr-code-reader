import './style.css'
import jsQR from "jsqr";

(async () => {
  const video = document.createElement("video");
  const foundCameraCanvas = document.getElementById("camera-canvas");
  const cameraCanvas = foundCameraCanvas instanceof HTMLCanvasElement
    ? foundCameraCanvas
    : document.createElement("canvas");
  const canvas = cameraCanvas.getContext("2d", {willReadFrequently: true}) ?? new CanvasRenderingContext2D();

  video.srcObject = await navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}});
  video.setAttribute("playsinline", "");
  video.play();
  requestAnimationFrame(tick);

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      cameraCanvas.height = video.videoHeight;
      cameraCanvas.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, cameraCanvas.width, cameraCanvas.height);
      const imageData = canvas.getImageData(0, 0, cameraCanvas.width, cameraCanvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        console.log(code.data);
      }
    }
    requestAnimationFrame(tick);
  }
})();