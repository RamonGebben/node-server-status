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

        var panelDiv = createPanel(jsonStatus);
        statusDiv.appendChild(panelDiv);
    }

    function createPanel(jsonStatus){
        var panelDiv = document.createElement("div");
        panelDiv.className = "panel panel-default";

        var panelBody = document.createElement("div");
        panelBody.className = "panel-body";
        panelBody.innerHTML = createContent(jsonStatus);

        panelDiv.appendChild(panelBody);

        return panelDiv;
    }

    function createContent(jsonStatus){
        return "<strong>" + jsonStatus.name +  "</strong>" + " - " + jsonStatus.status;
    }

});