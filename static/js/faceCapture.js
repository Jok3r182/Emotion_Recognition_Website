let chart
Webcam.set({
    height: 500,
    width: 500,
    image_format: 'jpeg'
})
Webcam.attach("#myCamera")

function takePicture() {

    Webcam.snap(function (data_uri) {
        document.getElementById('yourImage').style.display = 'none';
        document.getElementById('imgResults').src = data_uri
        $("#resultsTabs").css("display", "block")
        $("#captureImage").css("display", 'none')
        $("#anotherImage").css("display", "block")
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
    let canvas = document.getElementById('chart')
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    let labels = ["Feared",
        "Happy",
        "Sad",
        "Neutral",
        "Surprised",
        "Disgusted",
        "Angry"]

    let datasets = []
    let i = 0
    obj.forEach(element => {
        let data = []
        for (let x in element.emotions) {
            data.push(element.emotions[x] * 100)
        }
        let temp = {
            label: i + ' Person',
            data: data,
            backgroundColor: getRandomColor(),
        }
        datasets.push(temp)
        i++
    });
    let ctx = document.getElementById('chart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: datasets
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    stacked: true // this should be set to make the bars stacked
                }],
                yAxes: [{
                    stacked: true // this also..
                }]
            }
        }
    })
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}