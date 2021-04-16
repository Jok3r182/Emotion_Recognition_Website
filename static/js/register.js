$(document).ready(function () {

    $("#btnRegister").click(function () {
        if (checkForm()) {
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
        }
    });
    $("#btnToLogin").click(function(){
        location.href = "/"
    })
});


function checkForm() {
    return testUsername() + testEmail() + testPassword() + testConfirmPassword() === 4
}

function testUsername() {
    let username = document.getElementById("inputUsername4")
    let usernameCheck = document.getElementById("warningUsername")
    let bool = 1

    if (username.value.length < 8) {
        username.style.borderColor = 'red'
        usernameCheck.classList = 'visible warning-color'
        usernameCheck.innerText = 'Username is too short.'
        bool = 0
    }
    return bool;
}

function testPassword() {
    let password = document.getElementById('inputPassword4')
    let passwordCheck = document.getElementById("warningPassword")
    let bool = 1
    if (password.value.length < 8) {
        password.style.borderColor = 'red'
        passwordCheck.classList = 'visible warning-color'
        passwordCheck.innerText = 'Password is too short.'
        bool = 0
    }
    return bool;
}

function testConfirmPassword() {
    let password = document.getElementById('inputPassword4')
    let confirmPassword = document.getElementById('inputPassword5')
    let passwordCheck = document.getElementById("warningConfirmPassword")
    let bool = 1
    if (password.value !== confirmPassword.value) {
        confirmPassword.style.borderColor = 'red'
        passwordCheck.classList = 'visible warning-color'
        passwordCheck.innerText = 'Passwords doesnt match.'
        bool = 0
    }
    if (confirmPassword.value === '') {
        confirmPassword.style.borderColor = 'red'
        passwordCheck.classList = 'visible warning-color'
        passwordCheck.innerText = 'Confirm password is empty.'
        bool = 0
    }
    return bool;
}

function validateEmail(mail)
{
 return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);

}

function testEmail() {
    let email = document.getElementById('inputEmail4')
    let emailCheck = document.getElementById('warningEmail')
    let bool = 1

    if (!validateEmail(email.value)) {
        email.style.borderColor = 'red'
        emailCheck.classList = 'visible warning-color'
        emailCheck.innerText = 'This is not an email.'
        bool = 0
    }
    if (email.value === '') {
        email.style.borderColor = 'red'
        emailCheck.classList = 'visible warning-color'
        emailCheck.innerText = 'Email is too short.'
        bool = 0
    }


    return bool
}

