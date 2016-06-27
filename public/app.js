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