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
});