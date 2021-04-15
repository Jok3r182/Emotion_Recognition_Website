$(document).ready(function () {
    $("#btnRegister").click(function () {
        let username = document.getElementById("inputUsername4").value
        let password = document.getElementById("inputPassword4").value
        let email = document.getElementById("inputEmail4").value
        let data = {
            "id": 100, "username": username, "email": email, "password_hash": password
        }
        $.ajax({
            type: "POST",
            url: "/users",
            processData: false,
            data: JSON.stringify(data),
            success: function (response) {
                 sessionStorage.setItem("access_token", response.access_token)
                 sessionStorage.setItem("token_type", response.token_type)
                 window.location.href = "/main"
            },
            error: function (response) {
                alert(response)
                console.log(response)
            }
        })
    });
});