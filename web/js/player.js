$(document).ready(function() {
    reset();
    loadPButtons();
});

var person = {
    name: '',
    status: '',
    finished: '',
    id: '',
    points: '',
    avg: '',    
};

function loadPButtons(){
    $.get("api/player", function(data) {
        //for each player call createPlayerButton
        $.each(data, function(index) {
            createPlayerButton(data[index].id, data[index].name);
            if (data[index].status == "aktiv"){
                $("#"+ data[index].id).addClass("active");
            }
        });
    });
}

let playerbuttonStart = '<div class="col-lg-3" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block playerbtn" data-toggle="button" id="';
let playerbuttonID = '" onClick="select(this)"><span class="badge badge-primary badge-pill"></span>'; // style="background:rgb(106,180,70);"
let playerbuttonEnd = '</button></div>';

function createPlayerButton(id, name) {
    content = playerbuttonStart;
    content += id;
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
            createPlayerButton(returnedData.id, returnedData.name);
        },
        error: function(result) {
            alert('Spieler konnte nicht angelegt werden.');
        }
    })
};

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
    var postUrl = "/api/player/select/" + btn.id;
    $.ajax({
        type: "POST",
        url: postUrl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            $("#" + result.id + " .badge.badge-primary.badge-pill").text(result.order);
            $("#"+ result.id).attr("disabled", true);
        }
    })
};

function reset(){
    var resetUrl = "/api/reset"
    $.ajax({
        type: "POST",
        url: resetUrl,
        success: function(result) {
            $(".playerbtn .badge.badge-primary.badge-pill").text('');
            $(".playerbtn").attr("disabled", false);
            $(".playerbtn").removeClass("active");
        }
    })
};