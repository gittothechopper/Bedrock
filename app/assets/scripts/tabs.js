var tabs = function() {
    var toTog = $('[data-tab]'),
        buts = $('.js-tab-but');

    function init() {
        $(document).on('touchstart', buts, function(e) {
            e.preventDefault();
            tabs.toggletabs(e.target);
        });
        toTog.first().css({'opacity': 1});
    }

    function toggletabs(target) {
        var thisEl = $(target),
            target = $(target).data('target');


        if(!thisEl.hasClass('active')) {
            // Button state
            buts.removeClass('active');
            thisEl.addClass('active');
            toTog.on('webkitTransitionEnd', function() {
                toTog.off();
                $('[data-tab="' + target + '"]').css({'opacity': 1});
            });
            toTog.css({'opacity': 0});
        }
    }

    return {
        init: init,
        toggletabs: toggletabs
    }
}();