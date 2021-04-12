
/*const player = document.getElementById('player');


  navigator.mediaDevices.getUserMedia({
    video: true})
    .then((stream) => {
      player.srcObject = stream;
    });


  const captureButton = document.getElementById('capture');
  captureButton.addEventListener('click', () => {
   var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0);
  });
  player.srcObject.getVideoTracks().forEach(track => track.stop());
const webcamElement = document.createElement('webcam');
const canvasElement = document.createElement('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);
const captureButton = document.getElementById('capture');
webcam.start()
  .then(result =>{
    console.log("webcam started");
  })
  .catch(err => {
    console.log(err);
});
 captureButton.addEventListener('click', () => {
    let picture = webcam.snap()
     document.querySelector('#download-photo').href = picture
 })*/

const captureButton = document.getElementById("capture");
const img = document.getElementById("img");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");


function handleError(error) {
  console.error("Error: ", error);
}

captureButton.addEventListener('click', () => {
  navigator.mediaDevices
    .getUserMedia({video:true})
    .then(handleSuccess)
    .catch(handleError);

});

captureButton.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  // Other browsers will fall back to image/png
  img.src = canvas.toDataURL("image/webp");
});


function handleSuccess(stream) {
  video.srcObject = stream;
}