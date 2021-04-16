$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/token/decode",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', sessionStorage.getItem("token_type") + " " + sessionStorage.getItem("access_token"));
        },
        success: function (response) {
            window.location.href = "/main"
        },
        error: function (response) {
        }
    })
    document.getElementById("list-camera-list").classList += " disabled"
    document.getElementById("list-camera-list").textContent = "Camera (For Members Only)"
});