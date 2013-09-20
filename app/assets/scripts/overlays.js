var overlays = function() {
    var overlayWrap = $('#Overlays');

    function init() {
        $(document).on('touchstart', '[data-open="overlay"]', function() {
            var el = $(this),
                whatToOpen = el.attr('href').replace('#', '');

            openOverlay(whatToOpen);
        });

        $(document).on('touchstart', '[data-close="overlay"]', function() {
            closeOverlay();
        });
    }

    function openOverlay(what) {
        overlayWrap.addClass('active')
        $(what).addClass('overlay-active');
    }

    function closeOverlay() {
        overlayWrap.removeClass('active')
        $('.overlay-active').removeClass('active');
    }

    return {
        init: init
    }
}();