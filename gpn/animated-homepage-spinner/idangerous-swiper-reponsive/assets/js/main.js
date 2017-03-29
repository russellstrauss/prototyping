(function(){
	
	var renderPagersTablet =  function(swiper, current, total) {
		console.log("paginationCustomRender tablet, i: " + current);
	}

	var renderPagersMobile =  function(swiper, current, total) {
		console.log("paginationCustomRender mobile, i: " + current);
	}

	var config = {
		pagination: '.swiper-pagination',
		initialSlide: 0,
		mousewheelControl: true,
		slidesPerView: 3,
		centeredSlides: false,
		paginationClickable: true,
		spaceBetween: 30,
		breakpoints: {
			768: { // mobile config
				paginationType: 'custom',
				paginationCustomRender: renderPagersMobile
			},
			9999: {
				paginationType: 'custom',
				paginationCustomRender: renderPagersTablet
			}
		}
	}


	
	var initSwiper = function() {

		var swiper = new Swiper('.swiper-container', config);
		return swiper;
	}
	
	var swiper = initSwiper();
	// $(window).resize(function() {
	// 	swiper = initSwiper();
	// });

	
	var resetValuesForWindowResize = function() {
		// debugger;
		// swiper.destroy();
		// swiper = initSwiper();
	}

})();