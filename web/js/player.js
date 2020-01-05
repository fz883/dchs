$(document).ready(function () {
    $("#startGame").attr("disabled", true);
    $("#zuruecksetzen").attr("disabled", true);
    $("#title").html("Spieler auswählen: ");
    
    reset();
    reload();
});

var person = {
    name: '',
    status: '',
    finished: '',
    id: '',
    points: '',
    avg: '',
};

var playercount = 0;
var activecount = 0;
var deletemode = 0;

function setDelete(){
    console.log(deletemode);
    if (deletemode === 0) {
        deletemode = 1;
        $('#playerlist :button').css('background-color', 'red');
        $("#title").html("Welcher Spieler soll gelöscht werden?");
    } else {
        $("#title").html("Spieler auswählen: ");
        $('#playerlist :button').css('background-color', '');
        deletemode = 0;
        //$("#deletePlayer").removeClass("active");
    }
}

function reload(){
    playercount = 0;
    $('#playerlist').empty();
    $.when(loadPButtons()).done(function (data) {
        $.each(data, function (index) {
            createPlayerButton(data[index].id, data[index].name);
            playercount += 1;
        });
        checkPlayerCount();
    });
}

function loadPButtons() {
    return $.ajax({
        url: "api/player",
    });
}

function checkPlayerCount(){
    if (playercount >= 20) {
        $("#newPlayer").attr("disabled", true);
    } else {
        $("#newPlayer").attr("disabled", false);
    }
}

let playerbuttonStart = '<div class="col-lg-3" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block playerbtn" data-toggle="button" id="';
let playerbuttonID = '" onClick="select(this)"><span class="badge badge-light float-left"></span>'; // style="background:rgb(106,180,70);"
let playerbuttonEnd = '</button></div>';

function createPlayerButton(id, name) {
    content = playerbuttonStart;
    content += id;
    content += playerbuttonID;
    content += name;
    content += playerbuttonEnd;
    $('#playerlist').append(content);
};

$("#myButtons :input").change(function () {
    $.ajax({
        url: "/api/switchGame",
    });
});

//API FUNCTIONS

$("#neuerSpieler").click(function (e) {
    e.preventDefault();
    person.name = $("#spieler-name").val();
    if (person.name.length < 3){
        alert("Bitte mehr als 3 Zeichen eingeben");
    } else {
        person.status = 'inaktiv';
        createPlayer();
    }
});

$('#spielerModal').on('hidden.bs.modal', function(e) {
    $(this).find("input,textarea,select").val('').end();
  });

function createPlayer() {
    $.ajax({
        type: "POST",
        url: "/api/player",
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var returnedData = result;
            createPlayerButton(returnedData.id, returnedData.name);
            playercount += 1;
            checkPlayerCount()
        },
        error: function (result) {
            alert('Spieler konnte nicht angelegt werden.');
        }
    })
};

function getPlayer(id) {
    var getUrl = "/api/player/" + id;
    res = false;
    console.log("ajax get");
    $.ajax({
        url: getUrl,
        success: function (result) {
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

function deleteCall(deleteUrl){
    return $.ajax({
        url: deleteUrl,
    })
}

function select(btn) {
    if (deletemode === 1){
        console.log("Lösche Spieler " + btn.id);
        var deleteUrl = "/api/delete/" + btn.id;
        setDelete();
        $.when(deleteCall(deleteUrl)).done(function (data) {
            reload();
        });
    } else {       
        if (activecount >= 12){
            alert("Maximale Spielerzahl erreicht!");
            return;
        }
        $("#startGame").attr("disabled", false);
        $("#zuruecksetzen").attr("disabled", false);
        var postUrl = "/api/player/select/" + btn.id;
        $.ajax({
            type: "POST",
            url: postUrl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $("#" + result.id + " .badge.badge-light").text(result.order);
                $("#" + result.id).attr("disabled", true);
                activecount += 1;
                console.log(activecount);
            }
        })
    }
};

function reset() {
    var resetUrl = "/api/reset"
    $.ajax({
        type: "POST",
        url: resetUrl,
        success: function (result) {
            activecount = 0;
            $("#startGame").attr("disabled", true);
            $("#zuruecksetzen").attr("disabled", true);
            $(".playerbtn .badge.badge-light").text('');
            $(".playerbtn").attr("disabled", false);
            $(".playerbtn").removeClass("active");
        }
    })
};