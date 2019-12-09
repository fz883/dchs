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
    status: '',
    finished: '',
    id: '',
    points: '',
    avg: '',    
};

let playerbuttonStart = '<div class="col-lg-2" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block playerbtn" data-toggle="button" id="';
let playerbuttonID = '" onClick="select(this)">'; // style="background:rgb(106,180,70);"
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

function getPlayer(id){
    var getUrl = "/api/player/" + id;
    res = false;
    console.log("ajax get");
    $.ajax({
        url: getUrl,
        success: function(result) {
            window.person.name = result.name;
            window.person.status = result.status;
            window.person.points = result.points;
            return true;
        }
    });
    console.log(res);
    return res;
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

function update() {
    console.log("update")
    console.log(person)
    var postUrl = "/api/player/update/" + person.name;
    $.ajax({
        type: "POST",
        url: postUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
};


function select(btn) {
    if (getPlayer(btn.id)){
        if (person.status == "inaktiv") {
            //document.getElementById(btn.id).button('toggle');
            //document.getElementById(btn.id).style.background = "rgb(0, 123, 255)";        
            window.person.status = 'aktiv';
            update();
    
        } else {
            //document.getElementById(btn.id).style.background = "rgb(106, 180, 70)";
            window.person.status = 'inaktiv';
            update();
        }
    }
};