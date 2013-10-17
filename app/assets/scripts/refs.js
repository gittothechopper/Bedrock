var ref = [];
ref[1] = '<span>1.</span> Hello, Bob!';
ref[2] = '<span>2.</span> Hello, Frank!';
ref[3] = '<span>3.</span> Hello, Bill!';
ref[4] = '<span>4.</span> Hello, Ben!';


var refsModule = (function () {
    'use strict';

    function init() {
        // Wrap in function to avoid immediate call
        $(document).on('click', 'sup[data-refs]', function () {
            getRefs($(this).data('refs'));
        });
    }

    function getRefs(nums) {
        var data = nums;

        openRef(data.toString().split('-'));
    }

    function openRef(data) {
        // Cache Ref Placeholder
        var refCon = $('#References');

        // Empty div
        refCon.empty();
        refCon.append('<button class="close-modal"></button>');

        $.each(data, function (i, refNum) {
            refCon.append('<p>' + ref[refNum] + '</p>');
        });

        // This is reliant on the modal module
        modalModule.openModal('References');
    }

    return {
        init: init
    };
})();