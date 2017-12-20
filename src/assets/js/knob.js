$(function () {
    $(".dial").knob({
        'change': function (v) {}
    });
    $('.dial').trigger('configure', {
        "min": 1,
            "max": 32,
            "fgColor": "#87CEEB",
            "skin": "tron",
            "cursor": 10,
            "step": 2,



    });

});
