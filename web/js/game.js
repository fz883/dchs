$(document).ready(function () {
    $.when(getActive()).done(function (data) {
        $.each(data, function (index) {
            createPlayerList(data[index]);
            playerlist.push(data[index].id);
            playercount += 1;
        });
        next(playerlist[index]);
    });
});

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

function next(playerid) {
    console.log(playerid);
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
                displayPoints(returnedData.points);
                $("#spielername").html(returnedData.name);
            }
        }
    });
};

function displayPoints(points) {
    $("#punktzahl").html(points);
}

function doubleActive() {
    double = 2;
}

function tripleActive() {
    triple = 3;
    $('#pointbtn[value="25"]').attr("disabled", true);
}

function points(btn) {

    // if double --> double = 2 // Triple
    totalscore = (btn.value * double * triple);

    if (((person.points - totalscore) > 1) || (((person.points - totalscore) === 0) && (double == 2))) {
        person.points -= totalscore;
        if (person.score1 === '') {
            console.log(person.name + " scores " + totalscore + " with the first dart");
            person.score1 = parseInt(totalscore);
        } else if (person.score2 === '') {
            console.log(person.name + " scores " + totalscore + " with the second dart");
            person.score2 = parseInt(totalscore);
        } else if (person.score3 === '') {
            console.log(person.name + " scores " + totalscore + " with the third dart");
            person.score3 = parseInt(totalscore);
            var scoredthree = true;
        }
    } else { //if ((person.points - totalscore) <= 1) 

        person.points += person.score1;
        person.points += person.score2;
        person.points += person.score3;
        //hacky hack....
        person.points = parseInt(person.points);
        console.log(person.name + " scores " + totalscore + "! Too much!");
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
                displayPoints(person.points);
            }
        }
    })

    double = 1;
    $("#doublebtn").removeClass("active");
    triple = 1;
    $("#triplebtn").removeClass("active");
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