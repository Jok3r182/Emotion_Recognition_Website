 const player = document.getElementById('player');


  navigator.mediaDevices.getUserMedia({
    video: true})
    .then((stream) => {
      player.srcObject = stream;
    });


  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const captureButton = document.getElementById('capture');

  captureButton.addEventListener('click', () => {
    context.drawImage(player, 100, 100, canvas.width, canvas.height);
  });



