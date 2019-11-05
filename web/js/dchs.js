$(document).ready(function() {
    $.get("api/player", function(data) {
        //for each player call createPlayerButton
        $.each(data, function(index){
            createPlayerButton(data[index].name);
        });
    });
})

let spielmodus = 501

$("#neuerSpieler").click(function(e) {
    e.preventDefault();
    var spieler = $("#spieler-name").val()
        //alert("Modal submitted with text: " + field1value);
    var person = {
        name: spieler,
        points: spielmodus
    };
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
});

let playerbuttonStart = '<div class="col-lg-2" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block" id="';
let playerbuttonID = '" onClick="activate(this.id)" style="background:rgb(106,180,70);">';
let playerbuttonEnd = '</button></div>';

function createPlayerButton(name){
    console.log("createPlayerButton");
    content = playerbuttonStart;
    content += name;
    content += playerbuttonID;
    content += name;
    content += playerbuttonEnd; 
    $('#playerlist').append(content);
}

function activate(id) {
    console.log(id);
    var background = document.getElementById(id).style.backgroundColor;
    console.log(background);
    if ( background == "rgb(106, 180, 70)"){
        document.getElementById(id).style.background = "rgb(0, 123, 255)";
    } else {
        console.log(background);
        document.getElementById(id).style.background = "rgb(106, 180, 70)";
    }
}
