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
                drawChart(obj)
            },
            error: function (response) {
                console.log(response)
            }
        })

    })

}

function drawChart(obj) {
    let labels = []
    let data = []
    obj.forEach(element => {
        for (let x in element.emotions) {
            labels.push(x)
            data.push(element.emotions[x] * 100)
        }
    });
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: "Your emotion distribution in %",
                backgroundColor: '#001374',
                borderColor: 'black',
                data: data,
            }]
        },

        // Configuration options go here
        options: {}
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