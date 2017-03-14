(function(){
	
	window.onload = function()
	{
		// Triggering page load animations
		setTimeout(function(){
			$('.headline h2').css({'margin-left': 0, 'opacity': 1});
		}, 500);
		setTimeout(function(){
			$('.spinner-background').css({'opacity': 1});
		}, 750);
		setTimeout(function(){
			$('.headline .description').css({'opacity': 1});
		}, 900);
		
		var pagerFadeInInterval = 300;
		$('.spinner-pagination').addClass('page-load-animation');
		$('.spinner-pagination .pager').each(function(i){
			var $pager = $(this);
			var opacities = [1, .5, .25, .15]; // match to values set in CSS for .active, .next, .next-2, .next-3, or else just set the rest to 0.
			setTimeout(function(){
				try {
					$pager.css({'opacity': opacities[i]});
				}
				catch(error) {
					$pager.css({'opacity': 0});
				}
			}, 2000 + (pagerFadeInInterval*i)); // trigger animation of each page in 500 ms increments
		});
		setTimeout(function(){ // After all pagers have been animated in, remove page-load-animation class. This class allows us to distinguish the page load transitions from the actual UI transitions without conflict.
			$('.spinner-pagination').removeClass('page-load-animation');
		}, $('.spinner-pagination .pager').length * pagerFadeInInterval);
		
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
	
	var swiper = new Swiper('.swiper-container', {
		//preventClicks: false,
		//preventClicksPropagation: false,
		//speed: 500,
		//virtualTranslate: true, // breaks when loop set to true?
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
			var $pagination = $('.spinner-pagination');
			var $allPagers = $pagination.find('.pager');
			var $activePager = $('.spinner-pagination .pager').eq(current-1);
			
			var currentTop = 0;
			
			if (total > 5) {
				//debugger;
				$allPagers.removeClass('active prev next next-2 next-3');
				$allPagers.removeAttr('style');
				$activePager.addClass('active');
				$('.spinner-background').height($activePager.outerHeight());
				currentTop += $activePager.outerHeight();
				var $prev = getPrevSibling($activePager).addClass('prev');
				$prev.css('top', -1 * ($prev.outerHeight()));
				var $next = getNextSibling($activePager).addClass('next');
				$next.css('top', currentTop);
				currentTop += $next.outerHeight();
				var $next2 = getNextSibling($next).addClass('next-2');
				$next2.css('top', currentTop);
				currentTop += $next2.outerHeight();
				var $next3 = getNextSibling($next2).addClass('next-3');
				$next3.css('top', currentTop);
				currentTop += $next3.outerHeight();
				
				
			}
			
			// Move page controls to active pager
			var $pageControls = $allPagers.find('.swiper-page-prev, .swiper-page-next');
			$activePager.append($pageControls);
			
			// move $prev to bottom of the list (visually speaking) in order to have it fade in from the bottom correctly
			//$prev.hide();
			//$prev.css('top', currentTop);
		}
	});
	
	$('.swiper-pagination').on('click', '.prev', function(){
		swiper.slidePrev();
	});
	$('.swiper-pagination').on('click', '.next', function(){
		swiper.slideNext();
	});
	
	
})();