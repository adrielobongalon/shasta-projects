/* global $ Waypoint */

$(document).ready(function() {
    function stickyDiv() {
        var $stickyElement = $('.basic-sticky-example');
        var sticky;
    
        if ($stickyElement.length) {
            sticky = new Waypoint.Sticky({
                element: $stickyElement[0],
                wrapper: '<div class="sticky-wrapper waypoint" />'
            });
        }
    }

    $(window).on('load', function() {
        stickyDiv();
    });
});