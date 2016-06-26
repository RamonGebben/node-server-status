document.addEventListener("DOMContentLoaded", function (event) {
    console.log("LOADED");

    var isUp = document.getElementById('isUp');

    var statusUrl = "/status";

    fetch(statusUrl)
        .then(function (response) {
            console.log(response.status);
            if(response.ok){
                console.log("Status application running fine");
                response.json().then(function (json) {
                    console.log(json);
                    fillStatusList(json);
                });

            }
            else{
                console.log("The status application seems to run into troubles");
            }
        })
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });


    function fillStatusList(jsonStatus){
        var statusDiv = document.getElementById("status");
        var table = document.createElement("TABLE");
        statusDiv.appendChild(table);

        var tr = document.createElement("tr");
        table.appendChild(tr);

        var tdName = document.createElement("td");
        tdName.innerHTML = jsonStatus.name;
        tr.appendChild(tdName);

        var tdStatus = document.createElement("td");
        tdStatus.innerHTML = jsonStatus.status;
        tr.appendChild(tdStatus);

    }
});