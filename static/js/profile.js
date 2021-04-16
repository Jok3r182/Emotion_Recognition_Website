$(document).ready(function () {
     $("#btnBackToMain").click(function () {
       window.location.href = "/main"
     })
    document.getElementById('token').value = sessionStorage.getItem('access_token')
})