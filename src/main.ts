import './style.css'
import jsQR from "jsqr";
import {Point} from "jsqr/dist/locator";

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

  function drawLine(begin: Point, end: Point, color: string | CanvasGradient | CanvasPattern) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

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
        drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
        console.log(code.data);
      }
    }
    requestAnimationFrame(tick);
  }
})();