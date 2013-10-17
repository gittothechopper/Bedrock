$(document).on('click', function (e) {
    var left = e.pageX,
        top = e.pageY;

    if(e.ctrlKey) {
        var ref = prompt('Please enter the ref number.');

        if(ref !== undefined) {
            console.log('<button data-refs="' + ref + '" style="left: ' + left + 'px; top: ' + top + 'px;></button>');
        }
    }
})