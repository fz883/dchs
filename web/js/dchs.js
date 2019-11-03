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
let playerbuttonID = '" onClick="activate(this)" value="not_selected">';
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

function activate(btn) {
    var property = document.getElementById(btn.id);
    console.log(property.style.backgroundColor);
    console.log("Vorher: " + btn.val);
    if (property.val == "not_selected"){
        property.style.backgroundColor = "#007bff";
        property.val = "selected";
        console.log("Nachher: " + property.val);
    } else {
        console.log(property.val);
        property.style.backgroundColor = "#6ab446";
        property.val = "not_selected";
        console.log("Nachher: " + property.val);
    }
}