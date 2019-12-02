$(document).ready(function() {
    $.get("api/player", function(data) {
        //for each player call createPlayerButton
        $.each(data, function(index) {
            createPlayerButton(data[index].name);
        });

    });
});

var person = {
    name: '',
    status: 'inaktiv',
};


//API FUNCTIONS

function points(pointbtn){
    console.log(pointbtn.value)
}

function createPlayer() {
    $.ajax({
        type: "POST",
        url: "/api/player",
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            var returnedData = result;
            createPlayerButton(returnedData.name);
        },
        error: function(result) {
            alert('Spieler konnte nicht angelegt werden.');
        }
    })
};

function updateStatus() {
    var apiUrl = "/api/player/update/" + playerbuttonEnd.name;
    $.ajax({
        type: "POST",
        url: apiUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
};

function updatePoints() {
    var apiUrl = "/api/player/update/" + playerbuttonEnd.name;
    $.ajax({
        type: "POST",
        url: apiUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
};



function select(id) {
    let returnedData;
    $.get("/api/player/" + id, function(data) {
        returnedData = data;
        console.log(returnedData.status);
        if (returnedData.status == "inaktiv") {
            document.getElementById(id).style.background = "rgb(0, 123, 255)";
            person.name = returnedData.name;
            person.status = 'aktiv';
            updateStatus();

        } else {
            document.getElementById(id).style.background = "rgb(106, 180, 70)";
            person.name = returnedData.name;
            person.status = 'inaktiv';
            updateStatus();
        }
    });
};