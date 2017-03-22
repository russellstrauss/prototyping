(function(){


	var renderPagersTablet =  function(swiper, current, total) {
		console.log("paginationCustomRender tablet, i: " + current);
	}

	var renderPagersMobile =  function(swiper, current, total) {
		console.log("paginationCustomRender mobile, i: " + current);
	}

	var mobileConfig = {
		pagination: '.swiper-pagination',
		initialSlide: 0,
		mousewheelControl: true,
		slidesPerView: 3,
		centeredSlides: false,
		paginationClickable: true,
		spaceBetween: 0,
		paginationType: 'custom',
		paginationCustomRender: renderPagersMobile
	}

	var tabletConfig = {
		pagination: '.swiper-pagination',
		initialSlide: 0,
		mousewheelControl: true,
		slidesPerView: 3,
		centeredSlides: false,
		paginationClickable: true,
		spaceBetween: 30,
		paginationType: 'custom',
		paginationCustomRender: renderPagersTablet
	}



	var initSwiper = function() {

		if (window.innerWidth < 767) {
			var config = mobileConfig;
		}
		else {
			var config = tabletConfig;
		}

		var swiper = new Swiper('.swiper-container', config);
		return swiper;
	}
	
	initSwiper();
	$( window ).resize(function() {
		initSwiper();
	});

})();