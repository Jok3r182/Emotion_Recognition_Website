$(document).ready(function () {
    $("#btnLogin").click(function () {
        let username = document.getElementById("inputUsername").value
        let password = document.getElementById("inputPassword").value
        let data = new FormData()
        data.append("username", username)
        data.append("password", password)
        $.ajax({
            type: "POST",
            url: "/token",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                sessionStorage.setItem("access_token", response.access_token)
                sessionStorage.setItem("token_type", response.token_type)
                window.location.href = "/main"
            },
            error: function (response) {
                alert("bad input")
            }
        })
    });
});
