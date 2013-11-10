// This can also be used on a per page basis by declaring the array at the bottom of the page
var ref = [];
ref[1] = '<span>1. </span>bushel';
ref[2] = '<span>2. </span>magnifying';
ref[3] = '<span>3. </span>unstandardizable';
ref[4] = '<span>4. </span>mudjar';
ref[5] = '<span>5. </span>judgment';
ref[6] = '<span>6. </span>estoile';
ref[7] = '<span>7. </span>hemielytron';
ref[8] = '<span>8. </span>fattiness';
ref[9] = '<span>9. </span>janissaries';
ref[10] = '<span>10. </span>supertemporal';
ref[11] = '<span>11. </span>recapitalized';
ref[12] = '<span>12. </span>original';
ref[13] = '<span>13. </span>misology';
ref[14] = '<span>14. </span>monophthongize';
ref[15] = '<span>15. </span>motto';
ref[16] = '<span>16. </span>dioicous';
ref[17] = '<span>17. </span>interrupted';
ref[18] = '<span>18. </span>tarne';
ref[19] = '<span>19. </span>playwright';
ref[20] = '<span>20. </span>dreadnaught';


// Shut JSHint up
var modalModule = modalModule || {};


var refsModule = (function () {
	'use strict';

	function init() {
		// Wrap in function to avoid immediate call
		$(document).on('click', '[data-refs]', function () {
			getRefs($(this).html());
		});
	}

	function getRefs(nums) {
		console.log(nums);

		var arr = nums.split(','),
			result = [];

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].length === 1) {
				result.push(Number(arr[i]));
			} else {
				var split = arr[i].split('-'),
				high = split[1],
				low = split[0] - 1;

				while(low++ < high) {
					result.push(low);
				}
			}
		}

		console.log(result);
		openRef(result);
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
