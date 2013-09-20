var alertCustom = function() {

    function init() {
        $(document).on('touchstart', '[data-close="alert"]', function(e) {
            e.preventDefault();
            // Remove open alert
            $('#alert').remove();
        });
    }

    function openAlert(content) {
        // Remove open alert
        $('#alert').remove();

        // Open new
        $('body').append(
            '<div id="alert">' +
                '<div id="alert-content">' +
                    content +
                    '<a href="#" data-close="alert">Close</a>' +
                '</div>' +
            '</div>'
        );
    }

    return {
        init: init,
        openAlert: openAlert
    }
}();