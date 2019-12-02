$(document).ready(function() {
    $.get("api/player", function(data) {
        //for each player call createPlayerButton
        $.each(data, function(index) {
            createPlayerButton(data[index].name);
        });

    });
});

let spielmodus = 501;

var person = {
    name: '',
    status: 'inaktiv',
    points: spielmodus
};

let playerbuttonStart = '<div class="col-lg-2" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block playerbtn" id="';
let playerbuttonID = '" onClick="select(this)" style="background:rgb(106,180,70);">';
let playerbuttonEnd = '</button></div>';

function createPlayerButton(name) {
    content = playerbuttonStart;
    content += name;
    content += playerbuttonID;
    content += name;
    content += playerbuttonEnd;
    $('#playerlist').append(content);
};


//API FUNCTIONS

$("#neuerSpieler").click(function(e) {
    e.preventDefault();
    person.name = $("#spieler-name").val();
    person.status = 'inaktiv';
    createPlayer();
});

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
    var apiUrl = "/api/player/update/" + person.name;
    $.ajax({
        type: "POST",
        url: apiUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
};

function updatePoints() {
    var apiUrl = "/api/player/update/" + person.name;
    $.ajax({
        type: "POST",
        url: apiUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
};



function select(btn) {
    let returnedData;
    $.get("/api/player/" + btn.id, function(data) {
        returnedData = data;
        console.log(returnedData.status);
        console.log(btn.id);
        if (returnedData.status == "inaktiv") {
            document.getElementById(btn.id).style.background = "rgb(0, 123, 255)";
            person.name = returnedData.name;
            person.status = 'aktiv';
            updateStatus();

        } else {
            document.getElementById(btn.id).style.background = "rgb(106, 180, 70)";
            person.name = returnedData.name;
            person.status = 'inaktiv';
            updateStatus();
        }
    });
};