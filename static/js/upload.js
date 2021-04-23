$(document).ready(function () {
    function readURL(input) {
        if (input.files[0]) {
            let file = input.files[0]
            let reader = new FileReader();
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
        } else {
            document.getElementById("myFiles").value = null;
        }
    })

    $("#btnChangeImg").click(function () {
        document.getElementById("myFiles").value = null;
        $("#uploadImageRow").css("display", "block")
        $("#resultsTabs").css("display", "none")
        $("#changeImageRow").css("display", "none");
    })

    $("#btnGenerateResults").click(function () {
        let data = new FormData()
        data.append('predict_image', document.getElementById("myFiles").files[0])
        $("#resultsTabs").css("display", "block")
        let url = "/api/guest/predict"
        if(sessionStorage.getItem("user_type") === "member"){
            url = "/api/member/predict"
        }
        $.ajax({
            type: "POST",
            url: url,
            processData: false,
            contentType: false,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', sessionStorage.getItem("token_type") + " " + sessionStorage.getItem("access_token"));
            },
            success: function (response) {
                if(response.process_status === "Success"){
                    let obj = JSON.parse(response.processed_faces)
                    document.getElementById('emotion').innerText = "Predicted emotions:"
                    obj.forEach(element => {
                        document.getElementById('emotion').innerText += "\n" + element.predicted_emotion
                    })
                    drawChart(obj)
                }
                else{
                    document.getElementById('emotion').innerText = "Could not get results"
                    let canvas = document.getElementById('chart');
                    let ctx = canvas.getContext('2d')
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            },
            error: function (response) {
                console.log(response)
            }
        })
        
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


});