$(document).ready(function() {
    $.get("api/active", function(data) {
        //for each player call createPlayerButton
        $.each(data, function(index) {
            createPlayerButton(data[index].id, data[index].name);
        });

    });
});

let playerid = 0;

var person = {
    name: '',
    id: ''
};

let playerbuttonStart = '<div class="col-lg-2" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block playerbtn" data-toggle="button" id="';
let playerbuttonID = '" onClick="select(this)">'; // style="background:rgb(106,180,70);"
let playerbuttonEnd = '</button></div>';

function createPlayerButton(id, name) {
    content = playerbuttonStart;
    content += id;
    content += playerbuttonID;
    content += name;
    content += playerbuttonEnd;
    $('#playerlist').append(content);
};


let bullsListStart = '<li class="list-group-item d-flex justify-content-between align-items-center"><span class="badge badge-primary badge-pill">';
let bullsListID = 1
let bullsListMiddle = '</span>';

function createPlayerList(name) {
    content = bullsListStart;
    content += bullsListID;
    content += bullsListMiddle;
    content += name;
    content += "</li>";
    $('#bullslist').append(content);
};


//API FUNCTIONS

function select(btn) {
    let returnedData;
    $.get("/api/player/" + btn.id, function(data) {
        returnedData = data;
        createPlayerList(returnedData.name);
        bullsListID += 1;
    });

    $("#"+ btn.id).attr("disabled", true);
};