$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/token/decode",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', sessionStorage.getItem("token_type") + " " + sessionStorage.getItem("access_token"));
        },
        success: function (response) {
            sessionStorage.setItem("user_type", "member")
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
        $("#myCamera").css("display", "block")
        $("#resultsTabs").css("display", "none")
        $('#imgResults').attr('src', '#');
    });
});