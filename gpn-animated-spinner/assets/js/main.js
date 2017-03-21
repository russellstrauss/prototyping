// Bugs to fix
// 1. When changing window size, pagers indexing is messed up and tons of duplicate nodes added.


var pagers = []; // define out here for testing. move farther down in scope later.
var activePagers = [];

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
function triggerWindowResize() {
	var evt = document.createEvent('UIEvents'); 
	evt.initUIEvent('resize', true, false, window, 0); 
	window.dispatchEvent(evt);
}

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
	
	var calculateSlideDirection = function(prevIndex, currentIndex, total) {
		var direction;
		//first slide
		if (currentIndex == 1) {
			if (prevIndex == total) { // final slide was previous
				direction = "next"
			}
			else if (prevIndex > currentIndex) {
				direction = "prev";
			}
		}
		// final slide
		else if (currentIndex == total) {
			if (prevIndex == 1) { // first slide was previous
				direction = "prev";
			}
			else if (prevIndex < currentIndex) {
				direction = "next";
			}
		}
		// middle slides
		else { 
			if (prevIndex < currentIndex) {
				direction = "next";
			}
			else direction = "prev";
		}
		if (prevIndex == currentIndex) return false;
		return direction;
	}
	
	var copyAndShiftPagerPrev = function(pager) {
		
		var fadeOutTo = parseInt(pager.css('top')) + pager.outerHeight();
		var fadeInStart = 0 - pager.outerHeight();
		var fadeInTo = 0;
		
		pager.css({'top': fadeOutTo}).removeClass('active visible'); // fade out
		var $queued = pager.clone().css({'top': fadeInStart}).insertAfter(pager);
		var clearCSSCache = $queued.css('transition'); // For some reason transition won't show unless this property is accessed
		$queued.addClass('active visible').css({'top': fadeInTo});

		pager.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).remove();
		});
		return $queued; // set new pager in array since old one will fade out and be removed
	}
	var copyAndShiftPagerNext = function(pager, yPos) {
		
		var fadeOutTo = 0 - pager.outerHeight();
		var fadeInStart = yPos;
		
		pager.css({'top': fadeOutTo}).removeClass('active visible'); // slide up and out of the visible range		
		pager.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).remove();
		});
		var $queued = pager.clone().css({'top': fadeInStart}).insertAfter(pager);
		
		var fadeInTo = yPos - $queued.outerHeight();
		
		$queued.css({'top': fadeInTo}).addClass('visible');
		return $queued;
	}
	
	var copyAndShiftPagerInRangePrev = function(pagerFadeOut, pagerFadeIn) {
		
		var fadeOutTo = parseInt(pagerFadeOut.css('top')) + pagerFadeOut.outerHeight();
		var fadeInStart = 0 - pagerFadeIn.outerHeight();
		var fadeInTo = 0;
		
		pagerFadeOut.css({'top': fadeOutTo}).removeClass('active visible'); // fade out
		
		var $queued = pagerFadeIn.clone().css({'top': fadeInStart}).insertAfter(pagerFadeIn).removeClass('active visible');
		pagerFadeIn.hide();
		$queued.addClass('active visible').css({'top': fadeInTo});

		$queued.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).remove();
			pagerFadeIn.addClass('visible').removeAttr('style').css({'top': fadeInTo});
		});
		return pagerFadeIn;
	}

	
	var copyAndShiftPagerInRangeNext = function(pagerFadeOut, pagerFadeIn, yPos) {
		
		var fadeOutTo = 0 - pagerFadeOut.outerHeight();
		var fadeInStart = yPos;
		var fadeInTo = yPos - pagerFadeIn.outerHeight();
		
		pagerFadeOut.css({'top': fadeOutTo});
		pagerFadeOut.removeClass('active visible').addClass('transitioning'); // slide up and out of the visible range		
		pagerFadeOut.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).removeClass('transitioning');
		});

		var $queued = pagerFadeIn.clone().css({'top': fadeInStart}).insertAfter(pagerFadeIn).removeClass('active visible');
		pagerFadeIn.hide();
		$queued.addClass('visible').css({'top': fadeInTo});

		$queued.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			pagerFadeIn.remove();
		});
		return $queued;
	}
	
	var windowSize = window.innerWidth;
	var resetValuesForWindowResize = function() {
		$('.spinner-pagination').find('.pager').removeAttr('style');
	}
	var swiperObject = null;
	var initSpinner = debounce(function(){
	//var initSpinner = function(){
				
		//var pagers = [];

		if (windowSize < 767 && window.innerWidth > 767) { // if was mobile but is now tablet
			resetValuesForWindowResize();
			windowSize = window.innerWidth;
		}
		else if (windowSize > 767 && window.innerWidth < 767) {
			resetValuesForWindowResize();
			windowSize = window.innerWidth;
		}
		
		var prevSlideIndex = 0;
		var swiper = new Swiper('.swiper-container', {
			pagination: '.spinner-pagination',
			paginationClickable: true,
			direction: 'vertical',
			mousewheelControl: true,
			paginationType: 'custom',
			speed: 500,
			//effect: 'fade',
			parallax: true,
			setWrapperSize: true,
			loop: true,
			prevButton: '.swiper-page-prev',
			nextButton: '.swiper-page-next',
			
			paginationCustomRender: function(swiper, current, total) {
				
				console.clear();
				
				if (prevSlideIndex != current ) { // prevent firing twice on first and final slides (not sure why this happens but it is built in to idangerous slider)
					var numberOfPagersShowing = 4;
					var direction = calculateSlideDirection(prevSlideIndex, current, total);
					
					var $allPagers = $('.spinner-pagination').find('.pager').removeClass('active');
					$allPagers.removeClass(function (index, className) {
						return (className.match (/item-[0-9]/g) || []).join(' '); // remove all classes in the form [item-*] where * is a number
					});
					
					var currentTop = 0; // calculate position of each pager in the loop
					
					// loop through pagination
					$.each(pagers, function(i){
						
						// Shift pager array to have the active ones always at the top
						if (i == 0) {
							if (direction == "next") {
								pagers.push(pagers.shift());
							}
							else if (direction == "prev") {
								pagers.unshift(pagers.pop());
							}
							pagers[0].addClass('active');
							$('.spinner-background').height(pagers[0].outerHeight());
						}
						
						// Set pager locations
						if (i < numberOfPagersShowing) {
							
							pagers[i].addClass('item-' + i);
							
							// Queue up location for previous item to slide in
							if (i == 0 && direction == "prev") { 
								if (window.innerWidth > 767) {
									if (total == numberOfPagersShowing) { // If showing all pagers, for example showing 4 pagers at a time and there are only a total of 4 slides
										pagers[i] = copyAndShiftPagerPrev(pagers[i]);
									}
									else { // If only showing a range of pagers and not all pagers
										pagers[i] = copyAndShiftPagerInRangePrev(pagers[i + numberOfPagersShowing], pagers[i]);
									}
								}
							}
							else {
								if (window.innerWidth > 767 && !pagers[i].attr('class').includes('transitioning')) {
									pagers[i].addClass('visible');
									pagers[i].css({'top': currentTop});
								}
								else if (window.innerWidth < 767) {
									pagers[i].css({'bottom': 0});
								}
							}
							currentTop += pagers[i].outerHeight(); // calculate each pager's position
														
						}
						
						// Set pager location (only one pager showing) on mobile
						if (window.innerWidth < 767 && i == 0) {
							pagers[i].css({'bottom': 0});
						}
						
						// Queue up location for next item to slide in
						if (direction == "next" && i == numberOfPagersShowing - 1) {

							if (window.innerWidth > 767) {
								if (total == numberOfPagersShowing) { // If showing all pagers, for example showing 4 pagers at a time and there are only a total of 4 slides
									pagers[i] = copyAndShiftPagerNext(pagers[i], currentTop);
								}
								else { // If only showing a range of 1-n pagers and not all pagers
									pagers[i] = copyAndShiftPagerInRangeNext(pagers[total-1], pagers[i], currentTop);
								}
							}
						}
						
					});
					
					$('.spinner-pagination').height(currentTop);
					
					prevSlideIndex = current; // used to compute direction change
				}
			}
		});
		swiperObject = swiper; // wannabe return statement to allow debounce
		return swiper;
	//}
	}, 200);
	
	$('.spinner-pagination .pager').each(function(){
		pagers.push($(this));
	});
	
	initSpinner();
	$( window ).resize(function() {
		initSpinner();
	});
	
	// Add button interactions
	$('.spinner-pagination').on('click', '.prev', function(){
		swiperObject.slidePrev();
	});
	$('.spinner-pagination').on('click', '.next', function(){
		swiperObject.slideNext();
	});
	
	// dev test buttons
	$('#test-prev').click(function(){
		swiperObject.slidePrev();
	});
	$('#test-next').click(function(){
		swiperObject.slideNext();
	});
	
	
})();
