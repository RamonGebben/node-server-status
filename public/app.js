document.addEventListener("DOMContentLoaded", function (event) {
    console.log("LOADED");

    var isUp = document.getElementById('isUp');

    var statusUrl = "/status";
    var serversUrl = "/servers";

    fetch(serversUrl)
        .then(function (response) {
            console.log(response.status);
            if(response.ok){
                console.log("Status application running fine");
                response.json().then(function (jsonResponse) {
                    // console.log(jsonResponse);

                    if(jsonResponse.length < 1){
                        console.log("No servers to search for");        
                        fillEmptyStatus();        
                    }

                    for(var i = 0; i < jsonResponse.length; i++){
                        //For each, retrieve and print the status

                        var serverInfo = jsonResponse[i];
                        var completeStatusUrl = statusUrl + "/" + serverInfo.serverName;
                        console.log("Fetching status for " + completeStatusUrl);                
                        
                        fetch(completeStatusUrl)
                            .then(function (response) {
                                console.log(response.status);
                                if(response.ok){
                                    console.log("Status application running fine");
                                    response.json().then(function (json) {
                                        console.log(json);
                                        // fillStatusList(json);
                                    });

                                }
                                else{
                                    console.log("The status application seems to run into troubles for " + completeStatusUrl);
                                }
                            })
                            .catch(function (error) {
                                console.log('There has been a problem with your fetch operation: ' + error.message);
                            });
                    }
                });

            }
            else{
                console.log("Impossible to fetch server list");
            }
        })
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });

    /*
        Utility methods
    */

    function fillEmptyStatus(){
        var statusDiv = document.getElementById("status");

        var noServerMessage = document.createElement("p");
        noServerMessage.innerHTML = "No servers to search for";

        statusDiv.appendChild(noServerMessage);        
    }

    function fillStatusList(jsonStatus){
        var statusDiv = document.getElementById("status");

        var panelDiv = createPanel(jsonStatus);
        statusDiv.appendChild(panelDiv);
    }

    function createPanel(jsonStatus){
        var panelDiv = document.createElement("div");
        panelDiv.className = setPanelStatusColor(jsonStatus.status);

        var panelBody = document.createElement("div");
        panelBody.className = "panel-heading";
        panelBody.innerHTML = createContent(jsonStatus);

        panelDiv.appendChild(panelBody);

        return panelDiv;
    }

    function createContent(jsonStatus){
        return "<strong>" + 
            "<a href=\"" + jsonStatus.url + "\">" + jsonStatus.name + "</a>"
            +  "</strong>" + setstatus(jsonStatus.status);
    }

    function setstatus(status){
        return "<span class=\" " + setStatusIcon(status) + " pull-right\" aria-hidden=\"true\"></span>";
    }

    function setStatusIcon(status){
        if(status){
            return "glyphicon glyphicon-ok";
        }
        else{
            return "glyphicon glyphicon-remove";
        }
    }

    function setStatusColor(status){
        if(status){
            return "style=\"color:green\"";
        }
        else{
            return "style=\"color:red\"";
        }
    }

        function setPanelStatusColor(status){
        if(status){
            return "panel panel-success";
        }
        else{
            return "panel panel-danger";
        }
    }
});