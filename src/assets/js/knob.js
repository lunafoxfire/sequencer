$(function () {
    $("#volume-dial").knob({
        'change': function (v) {
          $('#hiddenVolumeValue').text(v);
        }
    });
    $('#volume-dial').trigger('configure', {
      "min": parseInt($('#volume-dial').attr('data-min')),
      "max": parseInt($('#volume-dial').attr('data-max')),
      "fgColor": "#87CEEB",
      "skin": "tron",
      "cursor": 10,
      "step": 1,
    });
});
