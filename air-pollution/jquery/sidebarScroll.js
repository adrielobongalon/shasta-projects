/* global $ */

// Cache selectors outside callback for performance. 
var $window = $(window);
var $stickyDiv = $("#sticky-div");
var distanceFromTop = $stickyDiv.offset().top;
var distanceScrolled = 0;




$(document).ready(function(){
    moveSidebar();
    $window.scroll(moveSidebar);
    $window.resize(resetOffset);
});




function moveSidebar() {
    distanceScrolled = $(window).scrollTop();

    if (distanceScrolled > distanceFromTop) {
        $stickyDiv.css("margin-top", (distanceScrolled - distanceFromTop - 2) + "px");
    }
    else {
        $stickyDiv.css("margin-top", "0px");
    }
}

function resetOffset() {
    distanceFromTop = $stickyDiv.offset().top;
    moveSidebar();
}