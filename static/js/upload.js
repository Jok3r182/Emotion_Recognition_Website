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
                    $('#blah').attr('src', e.target.result);
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
        $("#resultsTabs").css("display", "block")
        let pictureEmotion = document.getElementById('nuotaika')
        let data = new FormData()
        data.append('predict_image', document.getElementById("myFiles").files[0])
        $.ajax({
            type: "POST",
            url: "/api/predict",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
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
});