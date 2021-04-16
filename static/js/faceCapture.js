Webcam.set({
    height: 500,
    width: 500,
    image_format: 'jpeg'
})
Webcam.attach("#myCamera")

function takePicture() {
    let personImage
    Webcam.snap(function (data_uri) {
        personImage = document.getElementById('yourImage').innerHTML = '<img height="500" width="500" src="' + data_uri + '"/>';
        let img = dataURLtoFile(data_uri, 'personImg.jpeg')
        let data = new FormData()
        document.getElementById('myCamera').style.display = 'none'
        data.append('predict_image', img)
        $.ajax({
            type: "POST",
            url: "/api/predict",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                console.log(response)
                let obj = JSON.parse(response.processed_faces)
                obj.forEach(element => {
                    console.log(element.emotions)
                    console.log("Predicted: " + element.predicted_emotion + ", with: " + element.emotions[element.predicted_emotion] * 100 + "%")
                });
            },
            error: function (response) {
                console.log(response)
            }
        })
    })

}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}