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
				if (prevSlideIndex != current ) { // prevent firing twice on first and final slides (not sure why this happens but it is built in to idangerous slider)
					var currentIndex = current-1;
					var direction = calculateSlideDirection(prevSlideIndex, current, total);
					var numberOfPagersShowing = 4;
					var $pagination = $('.spinner-pagination');
					var $allPagers = $pagination.find('.pager').removeClass('active visible');
					var $activePager = pagers[currentIndex].addClass('active');
					activePagers = [];
					
					console.log(pagers[0].text());
					
					var currentTop = 0; // calculate position of each pager

					$.each(pagers, function(i){
						
						var wrapAroundIndex = -(total - (currentIndex + numberOfPagersShowing));
						var hasWrapAround = currentIndex + numberOfPagersShowing > total;
						if (i >= currentIndex && i < (currentIndex + numberOfPagersShowing) || (hasWrapAround && (i < wrapAroundIndex))) { // if currently showing range has to wrap around from the end back to the beginning
							pagers[i].addClass('visible');
							activePagers.push(pagers[i]);
						}
						
						pagers[i].css({'top': currentTop});
						currentTop += pagers[i].outerHeight();
						
						if (direction == "next") {
							//pagers.shift();
						}
						else if (direction == "prev") {
							
						}
					});
					prevSlideIndex = current;
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