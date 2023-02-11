const videoElement = document.getElementById("videoElement");
let startCameraButton = document.getElementById("startCamera");
let switchCameraButton = document.getElementById("switchCamera");
let captureImageButton = document.getElementById("captureImage");
let imageLibraryButton = document.getElementById("imageLibrary");

startCameraButton.addEventListener("click", async () => {
  // start camera
  const cameras = await navigator.mediaDevices.enumerateDevices();
  const videoCameras = cameras.filter(device => device.kind === "videoinput");
  if (videoCameras.length < 1) {
    alert("No video camera found");
    return;
  }
  let currentCameraIndex = videoCameras.length - 1;
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: videoCameras[currentCameraIndex].deviceId
    }
  });
  videoElement.style.display = "inline-block";
  videoElement.srcObject = stream;
  videoElement.play();

  // fullscrean mode
  if( document.body.requestFullscreen ) {               // Chrome & Firefox v64 or later
      document.body.requestFullscreen();
  } else if( document.body.mozRequestFullScreen ) {     // Firefox v63 or earlier
      document.body.mozRequestFullScreen();
  } else if( document.body.webkitRequestFullscreen ) {  // Safari & Edge & Chrome v68 or earlier
      document.body.webkitRequestFullscreen();
  } else if( document.body.msRequestFullscreen ) {      // IE11
      document.body.msRequestFullscreen();
  }

  // Switch Camera Device.
  startCameraButton.style.display = "none";
  switchCameraButton.style.display = "inline-block";
  switchCameraButton.addEventListener("click", async () => {
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    currentCameraIndex = (currentCameraIndex + 1) % videoCameras.length;
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoCameras[currentCameraIndex].deviceId
      }
    });
    videoElement.srcObject = newStream;
    videoElement.play();
  });

  // capture Image
  captureImageButton.style.display = "inline-block";
  captureImageButton.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext("2d").drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    let date = new Date();
    let filename = `camera-${date.getTime()}.png`;
    canvas.toBlob(blob => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    }, "image/png");
  });

  // Image Library
  imageLibraryButton.style.display = "inline-block";
});

document.addEventListener("fullscreenchange", function() {
  // event handler when quit fullscreen.
  if (!document.fullscreenElement) {
    startCameraButton.style.display = "inline-block";
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    videoElement.style.display = "none";
    switchCameraButton.style.display = "none";
    captureImageButton.style.display = "none";
    imageLibraryButton.style.display = "none";
  }
});
