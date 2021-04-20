$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/token/decode",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', sessionStorage.getItem("token_type") + " " + sessionStorage.getItem("access_token"));
        },
        success: function (response) {
        },
        error: function (response) {
            sessionStorage.setItem("access_token", "")
            window.location.href = "/guest"
        }
    })
    $("#aLogout").click(function () {
        sessionStorage.setItem("access_token", "")
        window.location.href = "/"
    });
    $("#list-camera-list").click(function () {
        $("#resultsTabs").css("display", "none")
        $('#imgResults').attr('src', '#');
        let canvas = document.getElementById('chart')
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    });
});