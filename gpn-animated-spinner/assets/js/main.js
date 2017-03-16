var pagers = [];
var activePagers = [];

(function(){
	
	// define out here for testing. move farther down in scope later.
	
	
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
	
	
	var initSpinner = function(){
		
		//var pagers = [];
		$('.spinner-pagination .pager').each(function(){
			pagers.push($(this));
		});
		
		var prevSlideIndex = 0;
		var swiper = new Swiper('.swiper-container', {
			pagination: '.spinner-pagination',
			paginationClickable: true,
			direction: 'vertical',
			mousewheelControl: true,
			paginationType: 'custom',
			speed: 500,
			effect: 'fade',
			parallax: true,
			setWrapperSize: true,
			loop: true,
			prevButton: '.swiper-page-prev',
			nextButton: '.swiper-page-next',
			
			paginationCustomRender: function(swiper, current, total) {
				
				console.clear();
				
				if (prevSlideIndex != current ) { // prevent firing twice on first and final slides (not sure why this happens but it is built in to idangerous slider)
					var currentIndex = current-1;
					var direction = calculateSlideDirection(prevSlideIndex, current, total);
					var numberOfPagersShowing = 3;
					var $pagination = $('.spinner-pagination');
					var $allPagers = $pagination.find('.pager').removeClass('item-0 item-1 item-2 item-3');
					
					activePagers = [];
										
					var currentTop = 0; // calculate position of each pager
					
					// loop through pagination
					$.each(pagers, function(i){
						
						// ideas for tomorrow
						// create clones to swoop in from above or below, then place the original in its place, show it, then delete the clones
						
						// Shift pager array to have the active ones always at the top
						if (direction == "next" && i == 0) {
							pagers.push(pagers.shift());
						}
						else if (direction == "prev" && i == 0) {
							pagers.unshift(pagers.pop());
						}
						
						//console.log("index: [" + i + "]: " + pagers[i].text());
						
						// Set pager locations
						if (i < numberOfPagersShowing) {
							if (i == 0) {
								pagers[0].addClass('active')
							}
							pagers[i].addClass('visible');
							pagers[i].addClass('item-' + i);
							
							// if (direction == "prev" && i == 0) {
							// 	// calculate total height needed
							// 	$.each(function(index){
									
							// 	});
							// }
							// else {
								pagers[i].css({'top': currentTop});
								currentTop += pagers[i].outerHeight();
							//}
							
						}
						else { // Reset classes and remove top values for those that are no longer visible
							pagers[i].removeClass('active visible').removeAttr('style');
						}
						
						
						
						
						
						// Queue up location for next item to slide in
						if (direction == "next" && i == numberOfPagersShowing-1) { 
							pagers[i].css({'top': 0 - pagers[i].outerHeight()}).removeClass('active visible'); // slide up and out of the visible range
							
							pagers[i].on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function(){ // remove element after transition ends
								$(this).remove();
							});
							var $queued = pagers[i].clone().css({'top': currentTop}).insertAfter(pagers[i]);
							$queued.css({'top': currentTop - $queued.outerHeight()}).addClass('visible');
							pagers[i] = $queued;
						}
						if (direction == "prev" && i == 0) {
							// slide out last item visible
							
							// calculate total height of visible pagers
							//debugger;
							
							//var $queued = pagers[i].clone().css({'top': currentTop}).insertAfter(pagers[i]);
						}
						
						
						
						
					});
					
					prevSlideIndex = current; // used to compute direction change
				}
			}
		});
		return swiper;
	}
	var swiper = initSpinner();
	// Add button interactions
	$('.spinner-pagination').on('click', '.prev', function(){
		swiper.slidePrev();
	});
	$('.spinner-pagination').on('click', '.next', function(){
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