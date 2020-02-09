$(document).ready(function () {
    $.when(getPlayers()).done(function (data) {
        $.each(data, function (index) {
            if (data[index].active == true) {
                createPlayerList(data[index]);
                playerlist.push(data[index].id);
                playercount += 1;
            }
        });
        $("#newsticker").html("Newsticker: ");
        next(playerlist[0]);
    });
});

list1 = '<li class="list-group-item d-flex justify-content-between align-items-center" style="padding-left: 5px; padding-right: 5px;"><div class="col-sm-6" id="list-player-name" style="padding-left: 0px;">';
list2 = '</div><div class="col-lg-1 text-center" style="padding: 0;"><span class="badge badge-primary" id="';
list3 = '-score-1">-</span></div><div class="col-lg-1 text-center" style="padding: 0;"><span class="badge badge-primary" id="';
list4 = '-score-2">-</span></div><div class="col-lg-1 text-center" style="padding: 0;"><span class="badge badge-primary" id="';
list5 = '-score-3">-</span></div><strong><div class="col-lg-3 text-center" id="';
list6 = '-points" style="padding-right: 0;">';
list7 = '</div></strong></li>';

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

var playercount = 0;
var index = 0;
var playerlist = [];
var double = 1;
var triple = 1;
var round = 0;

var currentplayer;
var allplayers;


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
    if (triple === 3) {
        triple = 1;
        $("#triplebtn").removeClass("active");
        $('#pointbtn[value="25"]').attr("disabled", false);
        $('#doublebtn').attr("disabled", false);
    } else {
        triple = 3;
        $('#pointbtn[value="25"]').attr("disabled", true);
        $('#doublebtn').attr("disabled", true);
    }
}

function updateList(playerid) {
    $.each(allPlayers, function (index) {
        if (allPlayers[index].id != playerid) {
            order = allPlayers[index].order;
            score = allPlayers[index].score;
            //score is null in the beginning of a game
            if (score == null) {
                $("#" + order + "-score-1").html("-");
                $("#" + order + "-score-2").html("-");
                $("#" + order + "-score-3").html("-");
            } else {
                //when next round starts, show results of last round
                if (typeof score[round] == 'undefined'){
                    score1 = score[round-1][0];
                    score2 = score[round-1][1];
                    score3 = score[round-1][2];
                } else {
                    score1 = score[round][0];
                    score2 = score[round][1];
                    score3 = score[round][2];
                }


                if (allPlayers[index].tries === 1) {
                    $("#" + order + "-score-1").html(score3);
                    $("#" + order + "-score-2").html("-");
                    $("#" + order + "-score-3").html("-");
                } else if (allPlayers[index].tries === 2) {
                    $("#" + order + "-score-1").html(score2);
                    $("#" + order + "-score-2").html(score3);
                    $("#" + order + "-score-3").html("-");
                } else {
                    $("#" + order + "-score-1").html(score1);
                    $("#" + order + "-score-2").html(score2);
                    $("#" + order + "-score-3").html(score3);
                }
                $("#" + order + "-points").html(allPlayers[index].points);
            }
        }
    })
}

function getPlayers() {
    return $.ajax({
        url: "/api/player",
    });
};

function next(playerid) {
    var stillPlaying = 0;
    $.when(getPlayers()).done(function (data) {
        allPlayers = data;
        $.each(data, function (index) {
            //check if at least two player are not finished
            if (data[index].finished == false) {
                stillPlaying += 1;
            }
        });
        if (stillPlaying < 2) {
            console.log("End of game");
        } else {
            $.each(allPlayers, function (index) {
                if (allPlayers[index].id == playerid) {
                    currentplayer = allPlayers[index];
                }
            })
            if (currentplayer.finished == true) {
                index += 1;
                if (index > playercount - 1) {
                    index = 0;
                    round += 1;
                }
                next(index);
            } else {
                console.log(currentplayer.name + " ist an der Reihe");
                updateList(playerid);
                var scores = [];
                var rounds = [];
                if (currentplayer.score == null) {
                    rounds.push(scores);
                    currentplayer.score = rounds;
                } else {
                    rounds = currentplayer.score;
                    rounds.push(scores);
                    currentplayer.score = rounds;
                }
                displayPoints(currentplayer.order, currentplayer.points, currentplayer.avg);
                $("#spielername").html(currentplayer.name);
                $("#dart1").html("-");
                $("#dart2").html("-");
                $("#dart3").html("-");
            }
        }
    });
}

//TODO: FIX BUG /// WRONG POINTS DISPLAYED
function displayPoints(order, points, avg) {
    $('#punktzahl').each(function () {
        var $this = $(this);
        jQuery({ Counter: $this.text() }).animate({ Counter: points }, {
            duration: 300,
            easing: 'swing',
            step: function () {
                $this.text(Math.round(this.Counter));
            }
        });
    });
    $('#punktzahl').html(points);
    $("#average").html(avg);
    $("#" + order + "-points").html(points);
    $("#" + order + "-score-1").html("-");
    $("#" + order + "-score-2").html("-");
    $("#" + order + "-score-3").html("-");
}


function oopsImadeAmistake() {
    if (person.score3 != '') {
        person.points = person.points + person.score3;
        person.score3 = '';
    } else if (person.score2 != '') {
        person.points = person.points + person.score2;
        person.score2 = '';
    } else if (person.score1 != '') {
        person.points = person.points + person.score1;
        person.score1 = '';
    }
}


function points(btn) {

    console.log(currentplayer.score)

    // if double --> double = 2 // Triple
    totalscore = (btn.value * double * triple);
    currentplayer.tries += 1;
    scoredthree = false;

    if (((currentplayer.points - totalscore) > 1) || (((currentplayer.points - totalscore) === 0) && (double == 2))) {
        currentplayer.points -= totalscore;
        if (typeof currentplayer.score[round][0] == 'undefined') {
            currentplayer.score[round][0] = parseInt(totalscore);
            $("#dart1").html(totalscore);
            $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte mit dem ersten Dart!")

        } else if (typeof currentplayer.score[round][1] == 'undefined') {
            currentplayer.score[round][1] = parseInt(totalscore);
            $("#dart2").html(totalscore);
            $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte mit dem zweiten Dart!")
        } else if (typeof currentplayer.score[round][2] == 'undefined') {
            currentplayer.score[round][2] = parseInt(totalscore);
            $("#dart3").html(totalscore);
            $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte mit dem dritten Dart!")
            scoredthree = true;
        }

        if (currentplayer.points == 0){
            currentplayer.finished = true;
        }
    } else { //if ((person.points - totalscore) <= 1) && double == 1

        currentplayer.points += currentplayer.score[round][0];
        currentplayer.points += currentplayer.score[round][1];
        currentplayer.points += currentplayer.score[round][2];
        //hacky hack....
        currentplayer.points = parseInt(currentplayer.points);
        console.log(currentplayer.points);
        $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte! No Score!")
        scoredthree = true;
    }

    var postUrl = "/api/update";
    $.ajax({
        type: "POST",
        url: postUrl,
        data: JSON.stringify(currentplayer),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
    if (!scoredthree) {
        displayPoints(currentplayer.order, currentplayer.points, currentplayer.avg);
    }

    double = 1;
    $("#doublebtn").removeClass("active");
    $('#doublebtn').attr("disabled", false);
    triple = 1;
    $("#triplebtn").removeClass("active");
    $('#triplebtn').attr("disabled", false);
    $('#pointbtn[value="25"]').attr("disabled", false);

    if (scoredthree || currentplayer.points == 0) {
        console.log("Neeext");
        index += 1;
        if (index > playercount - 1) {
            index = 0;
            round += 1;
        }
        console.log("Index ist: " + index);
        console.log(playerlist);
        next(playerlist[index]);
    }
}


