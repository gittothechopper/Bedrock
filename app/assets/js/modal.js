var modalModule = (function () {
	'use strict';

	// Cache modal bg
	var modalBg;

	function getId(id) {
		'use strict';
		return document.getElementById(id);
	}

	function init() {

		modalBg = getId('modal-bg');

		// Wrap in function to avoid immediate call
		$(document).on('click', '[data-modal]', function () {
			openModal($(this).data('modal'));
		});

		$(document).on('click', '.close-modal', function () {
			closeModal($(this).parent());
		});
	}

	function openModal(id) {
		// Get id of el to show and getElementById no need for jquery
		var el = getId(id.replace('#', ''));

		// If modal-bg is already active no need to reactivate it
		if (!modalBg.classList.contains('active')) {
			modalBg.style.display = 'block';
			// Requestanimationframe to allow transiton after display change
			window.requestAnimationFrame(function () {
				modalBg.classList.add('active');
			});
		}

		el.style.display = 'block';
		// Get highest z-index to allow stacking of modals (modal in modal in modal etc. go nuts)
		var lastZ = parseInt($('.modal.active:last').css('z-index'), 10) + 20 || 20;
		// Requestanimationframe to allow transiton after display change
		window.requestAnimationFrame(function () {
			window.scrollTo(0, 0);
			el.style.zIndex = lastZ;
			el.classList.add('active');
		});
	}

	function closeModal(el) {
		if ($('.modal.active').length < 2) {
			window.requestAnimationFrame(function () {
				el[0].classList.remove('active');
				el[0].style.display = 'none';
				$(modalBg).on('webkitTransitionEnd transitionend', function () {
					$(this)[0].style.display = 'none';
					$(this).off();
				});
				modalBg.classList.remove('active');
			});
		} else {
			window.requestAnimationFrame(function () {
				el.on('webkitTransitionEnd transitionend', function () {
					$(this)[0].style.display = 'none';
					$(this).off();
				});
				el[0].classList.remove('active');
			});
		}
	}

	return {
		init: init,
		openModal: openModal
	};
})();
