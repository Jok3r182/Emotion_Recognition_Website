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
            sessionStorage.setItem("user_type", "guest")
        }
    })
    document.getElementById("list-camera-list").classList += " disabled"
    document.getElementById("list-camera-list").textContent = "Camera (For Members Only)"
    $("#list-upload-list").click(function () {
        document.getElementById("myFiles").value = null;
        $("#uploadImageRow").css("display", "block")
        $("#resultsTabs").css("display", "none")
        $("#changeImageRow").css("display", "none");
        $('#imgResults').attr('src', '#');
    });
});