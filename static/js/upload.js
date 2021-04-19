$(document).ready(function () {
    function readURL(input) {
        if (input.files && input.files[0]) {
            let file = input.files[0]
            var reader = new FileReader();
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (!validImageTypes.includes(file['type'])) {
                alert("Files is not an image")
                return false
            } else {
                reader.onload = function (e) {
                    $('#imgResults').attr('src', e.target.result);
                }
                reader.readAsDataURL(file);

                return true
            }
        }
    }

    $("#myFiles").change(function () {
        if (readURL(this)) {
            $("#changeImageRow").css("display", "block");
            $("#uploadImageRow").css("display", "none");
            $("#nuotaika").css("display", "block")
        } else {
            document.getElementById("myFiles").value = null;
        }
    })

    $("#btnChangeImg").click(function () {
        document.getElementById("myFiles").value = null;
        $("#uploadImageRow").css("display", "block")
        $("#resultsTabs").css("display", "none")
        $("#changeImageRow").css("display", "none");
        $("#nuotaika").css("display", "none")
    })

    $("#btnGenerateResults").click(function () {
        let data = new FormData()
        data.append('predict_image', document.getElementById("myFiles").files[0])
        if (document.getElementById("list-camera-list").textContent === "Camera (For Members Only)") {
            $.ajax({
                type: "POST",
                url: "/api/dimensions",
                processData: false,
                contentType: false,
                data: data,
                success: function (response) {
                    let dimensions = JSON.parse(response.image_dimensions)

                    if (checkPictureDimensions(dimensions[0], dimensions[1])) {
                        generateResults(data)
                    } else {
                        alert("Your picture is bigger than 480x720")
                    }
                },
                error: function (response) {
                    console.log(response)
                }
            })
        } else {
            console.log(sessionStorage.getItem('access_token').value)
            generateResults(data)
        }
    })

    function drawChart(obj) {
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
        var ctx = document.getElementById('chart').getContext('2d');
        var chart = new Chart(ctx, {
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
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function checkPictureDimensions(x, y) {
        return x < 480 && y < 720
    }

    function generateResults(data) {
        $("#resultsTabs").css("display", "block")
        $.ajax({
            type: "POST",
            url: "/api/predict",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                let obj = JSON.parse(response.processed_faces)
                drawChart(obj)
            },
            error: function (response) {
                console.log(response)
            }
        })
    }

});