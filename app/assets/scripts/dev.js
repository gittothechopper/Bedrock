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

// Page array for swipe
var page = [];
page[1] = '/HOME.html';
page[2] = '/DPNP_SYMPTOMS.html';
page[3] = '/QOL_RECEPTOR_SPECIFICITIES.html';
page[4] = '/QOL_PATIENT_REVIEW.html';
page[5] = '/QOL_IMPROVING_QOL.html';
page[6] = '/EFFICACY_COMBO_DN.html';
page[7] = '/EFFICACY_SIMPLIFIED.html';
page[8] = '/EFFICACY_PRIMARY_ENDPOINT.html';
page[9] = '/EFFICACY_SUPRERIOR.html';
page[10] = '/EFFICACY_SUPRERIOR_FUNCTIONING.html';
page[11] = '/EFFICACY_COMBO_DN_SUMMARY.html';
page[12] = '/EFFICACY_NIGHT_PAIN.html';
page[13] = '/EFFICACY_DOSING_COMPLEXITY.html';
page[14] = '/SIMPLICITY_DOSING.html';
page[15] = '/GUIDELINES_COST_COMPARISON.html';
page[16] = '/GUIDELINES_BPS.html';
page[17] = '/GUIDELINES_CONTRAINDICATIONS.html';
page[18] = '/SUMMARY.html';
page[19] = '/ADDITIONAL_CHALLENGES.html';
page[20] = '/ADDITIONAL_PREVALENCE.html';
page[21] = '/ADDITIONAL_IMPORTANCE.html';
page[22] = '/ADDITIONAL_MOA.html';
page[23] = '/ADDITIONAL_FAST.html';
page[24] = '/ADDITIONAL_PAIN_REDUCTION.html';
page[25] = '/ADDITIONAL_SIMPLE_SOLUTION.html';
page[26] = '/ADDITIONAL_ADVERSE_EVENTS.html';
page[27] = '/ADDITIONAL_NO_WEIGHT_GAIN.html';
page[28] = '/ADDITIONAL_IMPROVING_QOL.html';
page[29] = '/ADDITIONAL_VIDEOS.html';
page[30] = '/ADDITIONAL_SUPPLEMENTS.html';
page[31] = '/ADDITIONAL_FOOT_TOOL.html';
page[32] = '/BIBLIOGRAPHY.html';
page[33] = '/PI.html';

// Swipe
var i = page.indexOf(window.location.pathname);

$(document).on('swipeLeft', function() {
    window.location = page[i+1];
});

$(document).on('swipeRight', function() {
    window.location = page[i-1];
});