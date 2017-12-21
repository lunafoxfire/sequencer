$(function () {
    $(".dial").knob({
        'change': function (v) {
          // TODO: Fix volume nob!
          $('#volume-dial').attr('value', v);

        }
    });
    $('.dial').trigger('configure', {
        "min": 1,
            "max": 32,
            "fgColor": "#87CEEB",
            "skin": "tron",
            "cursor": 10,
            "step": 1,
            // "data-angleOffset": -125,
            // "data-angleArc": 250,
            // "data-rotation": "anticlockwise"



    });

});
