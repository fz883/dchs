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
                if (typeof score[round] == 'undefined') {
                    //check if player threw three darts..must atleast have one score

                    score1 = score[round - 1][0];
                    $("#" + order + "-score-1").html(score1);

                    if (typeof score[round - 1][1] != 'undefined') {
                        score2 = score[round - 1][1];
                        $("#" + order + "-score-2").html(score2);
                    } else {
                        $("#" + order + "-score-2").html("-");
                    }
                    if (typeof score[round - 1][2] != 'undefined') {
                        score3 = score[round - 1][2];
                        $("#" + order + "-score-3").html(score3);
                    } else {
                        $("#" + order + "-score-3").html("-");
                    }

                } else {
                    score1 = score[round][0];
                    score2 = score[round][1];
                    score3 = score[round][2];
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
            if (data[index].active == true && data[index].finished == false) {
                stillPlaying += 1;
            }
        });
        console.log("Stillplaying: " + stillPlaying);
        //if (stillPlaying < 2) {
        //ToDo Implement Question Feierabend?
        //} else 
        if (stillPlaying == 0) {
            console.log("End of game");
        } else {
            $.each(allPlayers, function (index) {
                if (allPlayers[index].id == playerid) {
                    currentplayer = allPlayers[index];
                }
            })
            if (currentplayer.finished == true) {
                console.log("currentplayer finished");
                index += 1;
                if (index > playercount - 1) {
                    index = 0;
                    round += 1;
                }
                next(playerlist[index]);
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
    scoredthree = false;
    var dart = 1;

    console.log(currentplayer.score[round][0] + " " + typeof currentplayer.score[round][0]);
    console.log(currentplayer.score[round][1] + " " + typeof currentplayer.score[round][1]);
    console.log(currentplayer.score[round][2] + " " + typeof currentplayer.score[round][2]);

    //set score for current throw
    if (typeof currentplayer.score[round][0] == 'undefined') {
        currentplayer.score[round][0] = parseInt(totalscore);
    } else if (typeof currentplayer.score[round][1] == 'undefined') {
        currentplayer.score[round][1] = parseInt(totalscore);
        dart = 2;
    } else if (typeof currentplayer.score[round][2] == 'undefined') {
        currentplayer.score[round][2] = parseInt(totalscore);
        dart = 3;
    }

    currentplayer.points -= totalscore;

    //Check if throw was valid
    if ((currentplayer.points > 1) || ((currentplayer.points == 0) && (double == 2))) {
        currentplayer.tries += 1;


        switch (dart) {
            case 1:
                $("#dart1").html(totalscore);
                $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte mit dem ersten Dart!");
                break;
            case 2:
                $("#dart2").html(totalscore);
                $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte mit dem zweiten Dart!");
                break;
            case 3:
                $("#dart3").html(totalscore);
                $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte mit dem dritten Dart!");
                scoredthree = true;
                break;
        }

        console.log(currentplayer.points);
        if (currentplayer.points == 0) {
            currentplayer.finished = true;
        }

    } else { //if ((person.points - totalscore) <= 1) && double == 1

        console.log(currentplayer.score[round][0] + " " + typeof currentplayer.score[round][0]);
        console.log(currentplayer.score[round][1] + " " + typeof currentplayer.score[round][1]);
        console.log(currentplayer.score[round][2] + " " + typeof currentplayer.score[round][2]);

        switch (dart) {
            case 1:
                currentplayer.points += currentplayer.score[round][0];
                currentplayer.score[round][0] = 0;
                break;
            case 2:
                currentplayer.points += currentplayer.score[round][0];
                currentplayer.points += currentplayer.score[round][1];
                currentplayer.score[round][0] = 0;
                currentplayer.score[round][1] = 0;
                break;
            case 3:
                currentplayer.points += currentplayer.score[round][0];
                currentplayer.points += currentplayer.score[round][1];
                currentplayer.points += currentplayer.score[round][2];
                currentplayer.score[round][0] = 0;
                currentplayer.score[round][1] = 0;
                currentplayer.score[round][2] = 0;
                break;
        }

        //hacky hack....TODO: Check if necessary
        currentplayer.points = parseInt(currentplayer.points);
        console.log(currentplayer.points);
        $("#newsticker").html("Newsticker: " + currentplayer.name + " wirft " + totalscore + " Punkte! No Score!")
        scoredthree = true;
    }

    currentplayer.avg = calcAvg();

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
        next(playerlist[index]);
    }
}

function calcAvg() {
    var avg;

    //Math.round((num + Number.EPSILON) * 100) / 100
    avg = Math.round(((((501 - currentplayer.points) / currentplayer.tries) * 3) + Number.EPSILON) * 100) / 100;
    return avg;
}


