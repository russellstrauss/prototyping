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
					var numberOfPagersShowing = 4;
					var $pagination = $('.spinner-pagination');
					var $allPagers = $pagination.find('.pager').removeClass('item-0 item-1 item-2 item-3');
					
					activePagers = [];
										
					var currentTop = 0; // calculate position of each pager
					
					$.each(pagers, function(i){
						
						// ideas for tomorrow
						// create clones to swoop in from above or below, then place the original in its place, show it, then delete the clones
						
						if (direction == "next" && i == 0) {
							pagers.push(pagers.shift());
						}
						else if (direction == "prev" && i == 0) {
							pagers.unshift(pagers.pop());
						}
						
						//console.log("index: [" + i + "]: " + pagers[i].text());
						
						if (i < numberOfPagersShowing) {
							if (i == 0) {
								pagers[0].addClass('active')
							}
							pagers[i].addClass('visible');
							pagers[i].addClass('item-' + i);
							
							pagers[i].css({'top': currentTop});
							currentTop += pagers[i].outerHeight();
						}
						else {
							pagers[i].removeClass('active visible').removeAttr('style');
						}
						
						
						
						
					});
					
					//var $activePager = pagers[0].addClass('active'); // putting down here so that active class is added after page has been shifted
					//$allPagers.not('.visible').removeAttr('style');
					
					// queue up location for next item to slide in, make sure to do AFTER style attr is removed
					//if (direction == "next" && i == numberOfPagersShowing) {
						//pagers[i].css({'top': currentTop});
					//}
					
					prevSlideIndex = current; // used to compute direction change
				}
			}
		});
		return swiper;
	}
	var swiper = initSpinner();
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