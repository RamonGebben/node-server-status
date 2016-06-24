document.addEventListener("DOMContentLoaded", function (event) {
    console.log("LOADED");

    var isUp = document.getElementById('isUp');

    var statusUrl = "http://192.168.51.191:8080/servlets/soap?REQUEST=IsAlive";

    fetch(statusUrl)
        .then(function (response) {
            console.log(response.status);
            console.log(true);
            // return response.blob();
            // response.text().then(function (text) {
            // console.log(ok);
            // do something with the text response    
            // });
        })
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
});