//$('.header').height($(window).height());
$(document).ready(function() {
    $.get("api/player", function(data) {
        $(".playerlist").append("<p>Test</p>");
    });
})

$("#neuerSpieler").click(function(e) {
    //e.preventDefault();
    //$(".playerlist").append("<p>Test</p>");
    /*"last-name": $('#last-name').val()*/
    var person = {
        name: "Horst",
        points: 501
    };
    $.ajax({
        type: "POST",
        url: "/api/player",
        data: JSON.stringify(person),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            var returnedData = JSON.parse(result);
            //returnedData.name
            content = playerbuttonStart;
            content += returnedData.name;
            content += playerbuttonEnd;
            $(content).appendTo('.playerlist');
            $('.playerlist').append(createPlayerButton());
        },
        error: function(result) {
            alert('Spieler konnte nicht angelegt werden.');
        }
    });
});

var playerbuttonStart = '<div class="row"><div class="col-sm-3"><button type="button" class="btn btn-primary btn-lg btn-block">';
var playerbuttonEnd = '</button></div></div>';

$(document).ready(function() {
    $('.playerlist').append(playerbutton);
});

function createPlayerButton() {
    return $('<button/>', {
        text: 'Refresh Data',
        id: 'btn_refresh',
        click: ClickRefresh
    });
}