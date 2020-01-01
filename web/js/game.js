$(document).ready(function () {
    $.when(getActive()).done(function (data) {
        $.each(data, function (index) {
            createPlayerList(data[index]);
            playerlist.push(data[index].id);
            playercount += 1;
        });
        $("#newsticker").html("Newsticker: ");
        next(playerlist[index]);
    });
});

function updateList(){
    $.when(getActive()).done(function (data) {
        $.each(data, function (index) {
            order = data[index].order;
            score = data[index].score;
            score1 = score[score.length-3];
            score2 = score[score.length-2];
            score3 = score[score.length-1];
            $("#" + order + "-score-1").html(score1);
            $("#" + order + "-score-2").html(score2);
            $("#" + order + "-score-3").html(score3);
        });
    });
}

function getActive() {
    return $.ajax({
        url: "/api/active",
    });
};


var playercount = 0;
var index = 0;
var playerlist = [];
var double = 1;
var triple = 1;


var person = {
    name: '',
    id: '',
    points: '',
    score1: '',
    score2: '',
    score3: ''
};

list1='<li class="list-group-item d-flex justify-content-between align-items-center"><div class="col" id="list-player-name">';
list2='</div>|<div class="col text-center" id="';
list3='-score-1" style="padding: 0;"></div>|<div class="col text-center" id="';
list4='-score-2" style="padding: 0;"></div>|<div class="col text-center" id="';
list5='-score-3" style="padding: 0;"></div>|<div class="col" id="';
list6='-points" style="padding-right: 0;">';
list7='</div></li>';

function createPlayerList(player) {
    content = list1;
    content += player.name;
    content += list2;
    content += player.order;
    content += list3;
    content += player.order;
    content += list4;
    content += player.order;
    content += list5;
    content += player.order;
    content += list6;
    content += player.points;
    content += list7;
    $('#scorelist').append(content);
};

function next(playerid) {
    console.log(playerid);
    updateList();
    var getUrl = "/api/player/" + playerid;
    $.ajax({
        url: getUrl,
        success: function (result) {
            var returnedData = result;
            if (returnedData.finished == "true") {
                callNext();
            } else {
                person.name = returnedData.name;
                person.id = returnedData.id;
                person.points = returnedData.points;
                person.score1 = '';
                person.score2 = '';
                person.score3 = '';
                displayPoints(returnedData.order, returnedData.points, returnedData.avg);
                $("#spielername").html(returnedData.name);
                $("#dart1").html("-");
                $("#dart2").html("-");
                $("#dart3").html("-");
            }
        }
    });
};

function displayPoints(order, points, avg) {
    $("#punktzahl").html(points);
    $("#average").html(avg);
    $("#" + order + "-points").html(points);
}

function doubleActive() {
    if (double === 2) {
        double = 1;
        $("#doublebtn").removeClass("active");
        $('#triplebtn').attr("disabled", false);
    } else {
        double = 2;
        $('#triplebtn').attr("disabled", true);
    }
}

function tripleActive() {
    if (triple === 3){
        triple = 1;
        $("#triplebtn").removeClass("active");
        $('#pointbtn[value="25"]').attr("disabled", false);
        $('#doublebtn').attr("disabled", false);
    } else{
        triple = 3;
        $('#pointbtn[value="25"]').attr("disabled", true);
        $('#doublebtn').attr("disabled", true);
    }
}

function points(btn) {

    // if double --> double = 2 // Triple
    totalscore = (btn.value * double * triple);

    if (((person.points - totalscore) > 1) || (((person.points - totalscore) === 0) && (double == 2))) {
        person.points -= totalscore;
        if (person.score1 === '') {
            person.score1 = parseInt(totalscore);
            $("#dart1").html(totalscore);
            $("#newsticker").html("Newsticker: " + person.name + " wirft " + totalscore + " Punkte mit dem ersten Dart!")
            //Peter wirft xxx Punkte mit dem ersten Dart
        } else if (person.score2 === '') {
            person.score2 = parseInt(totalscore);
            $("#dart2").html(totalscore);
            $("#newsticker").html("Newsticker: " + person.name + " wirft " + totalscore + " Punkte mit dem zweiten Dart!")
        } else if (person.score3 === '') {
            person.score3 = parseInt(totalscore);
            $("#dart3").html(totalscore);
            $("#newsticker").html("Newsticker: " + person.name + " wirft " + totalscore + " Punkte mit dem dritten Dart!")
            var scoredthree = true;
        }
    } else { //if ((person.points - totalscore) <= 1) 

        person.points += person.score1;
        person.points += person.score2;
        person.points += person.score3;
        //hacky hack....
        person.points = parseInt(person.points);
        $("#newsticker").html("Newsticker: " + person.name + " wirft " + totalscore + " Punkte! No Score!")
        scoredthree = true;
    } 

    var postUrl = "/api/player/points";
    $.ajax({
        type: "POST",
        url: postUrl,
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var returnedData = result;
            person.points = returnedData.points;
            if (!scoredthree) {
                displayPoints(returnedData.order, person.points, returnedData.avg);
            }
        }
    })

    double = 1;
    $("#doublebtn").removeClass("active");
    $('#doublebtn').attr("disabled", false);
    triple = 1;
    $("#triplebtn").removeClass("active");
    $('#triplebtn').attr("disabled", false);
    $('#pointbtn[value="25"]').attr("disabled", false);

    if (scoredthree || person.points == 0) {
        console.log("Neeext");
        callNext();
    }


}

function callNext() {
    index += 1;
    if (index > playercount - 1) {
        index = 0;
    }
    var gameFinished = true;
    $.when(getActive()).done(function (data) {
        $.each(data, function (index) {
            if (data[index].finished == "false") {
                gameFinished = false;
                return gameFinished;
            }
        });
        if (gameFinished) {
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