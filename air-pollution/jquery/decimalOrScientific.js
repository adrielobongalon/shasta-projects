/* global $ */

var $scientificButton = $("#scientific-button");
var $decimalButton = $("#decimal-button");
var $scientific = $("#scientific");
var $decimal = $("#decimal");

var state = "scientific";




$(document).ready(function() {
    $decimal.hide();

    $scientificButton.click(toScientific);
    $decimalButton.click(toDecimal);
});




function toScientific() {
    if (state == "decimal") {
        state = "scientific";
        $decimal.fadeOut(400, function() {
            $scientific.fadeIn();
        });
    }
}

function toDecimal() {
    if (state == "scientific") {
        state = "decimal";
        $scientific.fadeOut(400, function() {
            $decimal.fadeIn();
        });
    }
}