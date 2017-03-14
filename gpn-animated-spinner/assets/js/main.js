(function(){
	
	
	
	
	var getNextSibling = function(jQueryObject) {
		if (!jQueryObject.next().length) {
			return jQueryObject.parent().children().first();
		}
		else return jQueryObject.next();
	}
	var getPrevSibling = function(jQueryObject) {
		if (!jQueryObject.prev().length) {
			return jQueryObject.parent().children().last();
		}
		else return jQueryObject.prev();
	}
	
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		//speed: 500,
		direction: 'vertical',
		mousewheelControl: true,
		paginationType: 'custom',
		//virtualTranslate: true, // breaks when loop set to true?
		effect: 'fade',
		parallax: true,
		//preventClicks: false,
		//preventClicksPropagation: false,
		loop: true,
		prevButton: '.swiper-page-prev',
		nextButton: '.swiper-page-next',
		
		paginationCustomRender: function(swiper, current, total) {
			var $pagination = $('.swiper-pagination');
			var $allPagers = $pagination.find('.pager');
			var $activePager = $('.swiper-pagination .pager').eq(current-1);
			
			// Set active class and add classes to three elements before and after active element
			$allPagers.removeClass('active prev prev-2 prev-3 next next-2 next-3');
			$activePager.addClass('active');
			var $next = getNextSibling($activePager).addClass('next');
			var $next2 = getNextSibling($next).addClass('next-2');
			var $next3 = getNextSibling($next2).addClass('next-3');
			var $prev = getPrevSibling($activePager).addClass('prev');
			var $prev2 = getPrevSibling($prev).addClass('prev-2');
			var $prev3 = getPrevSibling($prev2).addClass('prev-3');
			
			// Move page controls to active pager
			var $pageControls = $allPagers.find('.swiper-page-prev, .swiper-page-next');
			$activePager.append($pageControls);
		}
	});
	
	$('.swiper-pagination').on('click', '.prev', function(){
		swiper.slidePrev();
	});
	$('.swiper-pagination').on('click', '.next', function(){
		swiper.slideNext();
	});
	
	
})();