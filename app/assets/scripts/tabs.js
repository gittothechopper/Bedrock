var tabs = function() {
    var toTog = $('[data-tab]'),
        buts = $('.js-tab-but');

    function init() {
        $(document).on('touchstart', buts, function(e) {
            e.preventDefault();
            tabs.toggletabs($(this));
        });
        toTog.first().css({'opacity': 1});
    }

    function toggletabs(obj) {
        var thisEl = obj,
            target = obj.data('target');

        if(!thisEl.hasClass('active')) {
            // Button state
            buts.removeClass('active');
            thisEl.addClass('active');

            toTog.css({'opacity': 0});
            toTog.on('webkitTransitionEnd', function() {
                toTog.off();
                $('[data-tab="' + target + '"]').css({'opacity': 1});
            });
        }
    }

    return {
        init: init
    }
}();