$(document).ready(function () {
    reset();
});

function reset() {
    var resetUrl = "/api/reset"
    $.ajax({
        type: "POST",
        url: resetUrl,
    })
};