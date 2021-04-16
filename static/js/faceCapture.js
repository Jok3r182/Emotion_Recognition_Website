$(document).ready(function () {
    document.getElementById('myCamera').style.display = "none"
    Webcam.set({
        image_format: 'jpg'
    })

    Webcam.attach("#myCamera")

    function takePicture() {
        Webcam.snap(function (data_uri) {
            document.getElementById('yourImage').innerHTML = '<img src="' + data_uri + '"/>';
        })
    }
})


