// Bugs to fix
// 1. When changing window size, pagers indexing is messed up and tons of duplicate nodes added.

// 2. Back button doesnt work on mobile

var pagers = []; // define out here for testing. move farther down in scope later.
var activePagers = [];

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
	

	var renderPagersTablet =  function(swiper, current, total) {
		console.clear();
			
		if (prevSlideIndex != current ) { // prevent firing twice on first and final slides (not sure why this happens but it is built in to idangerous slider)
			var numberOfPagersShowing = 4;
			var direction = calculateSlideDirection(prevSlideIndex, current, total);
			var activeMargin = 25;
			var pagerSpacing = 10;
			var currentTop = activeMargin;
			
			var mobile = (window.innerWidth < 767);
			var tabletOrAbove = (window.innerWidth > 767);
			
			var $allPagers = $('.spinner-pagination').find('.pager').removeClass('active');
			$allPagers.removeClass(function (index, className) {
				return (className.match (/item-[0-9]/g) || []).join(' '); // remove all classes in the form [item-*] where * is a number
			});
			
			
			// loop through pagination
			$.each(pagers, function(i){

				var firstPager = (i == 0);
										
				if (firstPager) { // Shift pager array to have the active ones always in first index
					if (direction == "next") {
						pagers.push(pagers.shift());
					}
					else if (direction == "prev") {
						pagers[total-1].css({'top': activeMargin});
						currentTop += activeMargin + pagerSpacing;
						
						pagers.unshift(pagers.pop());
					}
					pagers[0].addClass('active');
					
					if (mobile) $('.spinner-background').height(pagers[0].outerHeight());
					else $('.spinner-background').height(pagers[0].outerHeight() + activeMargin*2);
				}
				else {
					pagers[i][0].style.removeProperty('margin');
				}
				
				if (i < numberOfPagersShowing) {
					
					pagers[i].addClass('item-' + i);
					
					if (direction == "prev" && firstPager && tabletOrAbove) { 
						pagers[i] = copyAndShiftPagerPrev(pagers[i], pagers[i + numberOfPagersShowing], numberOfPagersShowing, total, activeMargin);
					}
					else if (tabletOrAbove && !pagers[i].attr('class').includes('transitioning')) {
						
						pagers[i].addClass('visible');
						pagers[i].css({'top': currentTop});
						
						if (firstPager) {
							currentTop += activeMargin;
							currentTop += pagerSpacing;
						}
						else if (i != numberOfPagersShowing - 1) {
							currentTop += pagerSpacing;
						}
					}

					currentTop += pagers[i].outerHeight(); // calculate each pager's position
					
					if (mobile && firstPager) { 
						pagers[i].css({'bottom': 0}); // Set pager location on mobile
					}
				}
				
				if (direction == "next" && i == numberOfPagersShowing - 1 && tabletOrAbove) {
					pagers[i] = copyAndShiftPagerNext(pagers[i], currentTop, pagers[total-1], numberOfPagersShowing, total);
				}
				
			});
			
			$('.spinner-pagination').height(currentTop);
			
			prevSlideIndex = current; // used to compute direction change
		}
	}

	var renderPagersMobile =  function(swiper, current, total) {
		console.log("paginationCustomRender mobile, i: " + current);
	}

	var prevWindowSize = window.innerWidth;
	var resetValuesForWindowResize = function() {
		$('.spinner-pagination').find('.pager').removeAttr('style');
	}
	var swiperObject = null;
	
	var config = {
		pagination: '.spinner-pagination',
		paginationClickable: true,
		direction: 'vertical',
		mousewheelControl: true,
		paginationType: 'custom',
		speed: 500, // match $transition-speed in CSS
		loop: true,
		prevButton: '.swiper-page-prev',
		nextButton: '.swiper-page-next',
		breakpoints: {
			768: { // mobile config
				paginationType: 'custom',
				paginationCustomRender: renderPagersMobile
			},
			9999: { // tablet and above
				paginationType: 'custom',
				paginationCustomRender: renderPagersTablet
			}
		}
	}
	
	var prevSlideIndex = 0;
	
	var initSpinner = debounce(function(){
		
		
		var mobile = (window.innerWidth < 767);
		var tabletOrAbove = (window.innerWidth > 767);

		if (prevWindowSize < 767 && tabletOrAbove) { // if was mobile but is now tablet
			resetValuesForWindowResize();
			prevWindowSize = window.innerWidth;
		}
		else if (prevWindowSize > 767 && mobile) {
			resetValuesForWindowResize();
			prevWindowSize = window.innerWidth;
		}
		
		var swiper = new Swiper('.swiper-container', config);
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

var copyAndShiftPagerPrev = function(currentPager, pagerFadeOut, numberOfPagersShowing, total, activeMargin) {
	
	if (total == numberOfPagersShowing) { // If showing all pagers, for example showing 4 pagers at a time and there are only a total of 4 slides
		var fadeOutTo = parseInt(currentPager.css('top')) + currentPager.outerHeight();
		var fadeInStart = 0 - currentPager.outerHeight();
		var fadeInTo = 0 + activeMargin;
		
		currentPager.css({'top': fadeOutTo}).removeClass('active visible'); // fade out
		var $queued = currentPager.clone().css({'top': fadeInStart}).insertAfter(currentPager);
		var clearCSSCache = $queued.css('transition'); // For some reason transition won't show unless this property is accessed
		$queued.addClass('active visible').css({'top': fadeInTo});

		currentPager.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).remove();
		});
		return $queued; // set new pager in array since old one will fade out and be removed
	}
	else { // If only showing a range of pagers and not all pagers
		var fadeOutTo = parseInt(pagerFadeOut.css('top')) + pagerFadeOut.outerHeight();
		var fadeInStart = 0 - currentPager.outerHeight();
		var fadeInTo = 0 + activeMargin;
		
		pagerFadeOut.css({'top': fadeOutTo}).removeClass('active visible'); // fade out
		
		var $queued = currentPager.clone().css({'top': fadeInStart}).insertAfter(currentPager).removeClass('active visible');
		currentPager.hide();
		$queued.addClass('active visible').css({'top': fadeInTo});

		$queued.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).remove();
			currentPager.addClass('visible').removeAttr('style').css({'top': fadeInTo});
		});
		return currentPager;
	}
}
var copyAndShiftPagerNext = function(currentPager, yPos, pagerFadeOut, numberOfPagersShowing, total) {
	
	if (total == numberOfPagersShowing) { // If showing all pagers, for example showing 4 pagers at a time and there are only a total of 4 slides
		var fadeOutTo = 0 - currentPager.outerHeight();
		var fadeInStart = yPos;
		
		currentPager.css({'top': fadeOutTo}).removeClass('active visible'); // slide up and out of the visible range		
		currentPager.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).remove();
		});
		var $queued = currentPager.clone().css({'top': fadeInStart}).insertAfter(currentPager);
		
		var fadeInTo = yPos - $queued.outerHeight();
		
		$queued.css({'top': fadeInTo}).addClass('visible');
		return $queued;
	}
	else { // If only showing a range of 1-n pagers and not all pagers
		var fadeOutTo = 0 - pagerFadeOut.outerHeight();
		var fadeInStart = yPos;
		var fadeInTo = yPos - currentPager.outerHeight();
		
		pagerFadeOut.css({'top': fadeOutTo});
		pagerFadeOut.removeClass('active visible').addClass('transitioning'); // slide up and out of the visible range		
		pagerFadeOut.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			$(this).removeClass('transitioning');
		});

		var $queued = currentPager.clone().css({'top': fadeInStart}).insertAfter(currentPager).removeClass('active visible');
		currentPager.hide();
		$queued.addClass('visible').css({'top': fadeInTo});

		$queued.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
			currentPager.remove();
		});
		return $queued;
	}
}

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