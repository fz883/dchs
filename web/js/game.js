$(document).ready(function() {
    $.when(getActive()).done(function(data){
        $.each(data, function(index) {
            createPlayerList(data[index]);
            playerlist.push(data[index].id);
            playercount += 1;
        });
        next(playerlist[index]);
    });
});

function getActive(){
    return $.ajax({
        url: "/api/active",
    });
};


var playercount = 0;
var index = 0;
var playerlist = [];


var person = {
    name: '',
    id: '',
    points: '',
    score1: '',
    score2: '',
    score3: ''
};

let bullsListStart = '<li class="list-group-item d-flex justify-content-between align-items-center"><span class="badge badge-primary badge-pill">';
let bullsListMiddle = '</span>';

function createPlayerList(player) {
    content = bullsListStart;
    content += player.order;
    content += bullsListMiddle;
    content += player.name;
    content += "</li>";
    $('#bullslist').append(content);
};

function next(playerid){
    console.log(playerid);
    var getUrl = "/api/player/" + playerid;
    $.ajax({
        url: getUrl,
        success: function(result) {
            var returnedData = result;
            if (returnedData.finished == "true"){
                callNext();
            } else {
                person.name = returnedData.name;
                person.id = returnedData.id;
                person.points = returnedData.points;
                person.score1 = '';
                person.score2 = '';
                person.score3 = '';
                displayPoints(returnedData.points);
                $("#spielername").html(returnedData.name);
            }
        }
    });
};

function displayPoints(points){
    $("#punktzahl").html(points);
}

function points(btn){
    if ((person.points - btn.value) < 0){
        console.log(typeof person.points)
        console.log(typeof person.score1)
        person.points += parseInt(person.score1);
        person.points += parseInt(person.score2);
        person.points += parseInt(person.score3);
        console.log("too much: " + person.points)
        scoredthree = true;
    } else {

        person.points -= btn.value;
        if (person.score1 == ''){
            console.log(person.name + " scores " + btn.value + " with the first dart");
            person.score1 = btn.value;
        } else if (person.score2 == ''){
            console.log(person.name + " scores " + btn.value + " with the second dart");
            person.score2 = btn.value;
        } else if (person.score3 == ''){
            console.log(person.name + " scores " + btn.value + " with the third dart");
            person.score3 = btn.value;
            var scoredthree = true;
        }
    }

    var postUrl = "/api/player/points";
    $.ajax({
        type: "POST",
        url: postUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            var returnedData = result;
            person.points = returnedData.points;
            if (!scoredthree){
                displayPoints(person.points);
            }
        }
    })

    if (scoredthree || person.points == 0){
        console.log("Neeext");
        callNext();
    }

    
}

function callNext(){
    index += 1;
    if (index > playercount - 1){
        index = 0;
    }
    var gameFinished = true;
    $.when(getActive()).done(function(data){
        $.each(data, function(index) {
            if (data[index].finished == "false"){ 
                gameFinished = false;       
                return gameFinished;
            } 
        });
        if (gameFinished){
            console.log("End of game");
        } else {
            next(playerlist[index]);
        }
    });
    
}




//API FUNCTIONS

/*function select(btn) {
    let returnedData;
    $.get("/api/player/" + btn.id, function(data) {
        returnedData = data;
        createPlayerList(returnedData.name);
    });

    $("#"+ btn.id).attr("disabled", true);
};*/