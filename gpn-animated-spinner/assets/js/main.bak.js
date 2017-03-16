(function(){
	
	window.onload = function()
	{
		
		// // Triggering page load animations
		// setTimeout(function(){
		// 	$('.headline h2').css({'margin-left': 0, 'opacity': 1});
		// }, 500);
		// setTimeout(function(){
		// 	$('.spinner-background').css({'opacity': 1});
		// }, 750);
		// setTimeout(function(){
		// 	$('.headline .description').css({'opacity': 1});
		// }, 900);
		
		// var pagerFadeInInterval = 300;
		// $('.spinner-pagination').addClass('page-load-animation');
		// $('.spinner-pagination .pager').each(function(i){
		// 	var $pager = $(this);
		// 	var opacities = [1, .5, .25, .15]; // match to values set in CSS for .active, .next, .next-2, .next-3, or else just set the rest to 0.
		// 	setTimeout(function(){
		// 		try {
		// 			$pager.css({'opacity': opacities[i]});
		// 		}
		// 		catch(error) {
		// 			$pager.css({'opacity': 0});
		// 		}
		// 	}, 2000 + (pagerFadeInInterval*i)); // trigger animation of each page in 500 ms increments
		// });
		// setTimeout(function(){ // After all pagers have been animated in, remove page-load-animation class. This class allows us to distinguish the page load transitions from the actual UI transitions without conflict.
		// 	$('.spinner-pagination').removeClass('page-load-animation');
		// }, $('.spinner-pagination .pager').length * pagerFadeInInterval);
		
	}
	
	
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
	
	var calculateSlideDirection = function(prevIndex, currentIndex, total) {
		var direction;
		//first slide
		if (currentIndex == 1) {
			if (prevIndex == total) { // final slide was previous
				direction = "forward"
			}
			else if (prevIndex > currentIndex) {
				direction = "backward";
			}
		}
		// final slide
		else if (currentIndex == total) {
			if (prevIndex == 1) { // first slide was previous
				direction = "backward";
			}
			else if (prevIndex < currentIndex) {
				direction = "forward";
			}
		}
		// middle slides
		else { 
			if (prevIndex < currentIndex) {
				direction = "forward";
			}
			else direction = "backward";
		}
		if (prevIndex == currentIndex) return false;
		return direction;
	}
	
	var direction;
	var prevCurrent;
	var swiper = new Swiper('.swiper-container', {
		pagination: '.spinner-pagination',
		paginationClickable: true,
		direction: 'vertical',
		mousewheelControl: true,
		paginationType: 'custom',
		effect: 'fade',
		parallax: true,
		setWrapperSize: true,
		loop: true,
		prevButton: '.swiper-page-prev',
		nextButton: '.swiper-page-next',
		
		paginationCustomRender: function(swiper, current, total) {
			if (prevCurrent != current) { // prevent firing twice on first and final slides (not sure why this happens but it is built in to idangerous slider)
				var $pagination = $('.spinner-pagination');
				var $allPagers = $pagination.find('.pager');
				var $activePager = $('.spinner-pagination .pager').eq(current-1);
				
				var currentTop = 0; // calculate position of each pager
				
				//reset
				$allPagers.not('.current').removeAttr('style'); // so that the set top value persists in order to animate correctly
				$allPagers.removeClass('active prev current');
				$activePager.addClass('active current'); // current class means that it is one of the pagers currently showing or going to show on next slide
				$('.spinner-background').height($activePager.outerHeight()); // set white background height to same as active pager
				
				// shift all pagers
				$activePager.addClass('active').css({'top': 0});
				currentTop += $activePager.outerHeight();
				var $prev = getPrevSibling($activePager).addClass('prev');
				$prev.css('top', -1 * ($prev.outerHeight()));
				var $next = getNextSibling($activePager).addClass('current').css({'top': currentTop, "opacity": .5});
				currentTop += $next.outerHeight();
				var $next2 = getNextSibling($next).addClass('current').css({'top': currentTop, "opacity": .25});
				currentTop += $next2.outerHeight();
				var $next3 = getNextSibling($next2).addClass('current').css({'top': currentTop, "opacity": .15});
				currentTop += $next3.outerHeight();
				
				//debugger;
				
				// figure out which pagination should be queued up based on direction, then move it into place in preparation for animating in
				var $queued = $();
				$allPagers.removeClass('queued');
				direction = calculateSlideDirection(prevCurrent, current, total);
				if (direction == "forward") {
					var queuedLocation = 0;
					$('.spinner-pagination .current').each(function(){
						queuedLocation += $(this).outerHeight();
					});
					$queued = $('.spinner-pagination .pager').eq(current+2);
					$queued.addClass('no-transition');
					$queued.css({'top': queuedLocation, 'opacity': 0});
					$queued[0].offsetHeight; // this line clears cached CSS so that the transition property will be removed. See: http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
					$queued.removeClass('no-transition');
					$queued.css({'top': queuedLocation - $queued.outerHeight(), 'opacity': '.15'});
				}
				else if (direction == "backward") {
					//$queued = $('.spinner-pagination .pager').eq(current-2);
					//$queued.addClass('no-transition');
					//$queued.css({'top':  -1 * ($queued.outerHeight())});
					//$queued[0].offsetHeight; // this line clears cached CSS so that the transition property will be removed. See: http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
					//$queued.removeClass('no-transition');
				}
				
							
				// Move page controls to active pager
				var $pageControls = $allPagers.find('.swiper-page-prev, .swiper-page-next');
				$activePager.append($pageControls);
				prevCurrent = current;
			}
		}
	});
	
	// Add button interactions
	$('.swiper-pagination').on('click', '.prev', function(){
		swiper.slidePrev();
	});
	$('.swiper-pagination').on('click', '.next', function(){
		swiper.slideNext();
	});
	
	// dev test buttons
	$('#test-prev').click(function(){
		swiper.slidePrev();
	});
	$('#test-next').click(function(){
		swiper.slideNext();
	});
	
	
})();