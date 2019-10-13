$(document).ready(function() {
    $.get("api/player", function(data) {
        $(".playerlist").append("<p>Test</p>");
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
            //returnedData.name
            content = playerbuttonStart;
            content += returnedData.name;
            content += playerbuttonEnd;
            $(content).appendTo('#playerlist');
            $('.playerlist').append(createPlayerButton());
        },
        error: function(result) {
            alert('Spieler konnte nicht angelegt werden.');
        }
    })
});

let playerbuttonStart = '<div class="col-lg-2" id="spielerbutton"><button type="button" class="btn btn-primary btn-lg btn-block">';
let playerbuttonEnd = '</button></div>';