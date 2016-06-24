document.addEventListener("DOMContentLoaded", function (event) {
    console.log("LOADED");

    var isUp = document.getElementById('isUp');

    var statusUrl = "/status";

    fetch(statusUrl)
        .then(function (response) {
            console.log(response.status);
            // return response.blob();
            // response.text().then(function (text) {
            // console.log(ok);
            // do something with the text response    
            // });
            if(response.ok){
                console.log("it is up");
            }
            else{
                console.log("it is down");
            }
        })
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
});