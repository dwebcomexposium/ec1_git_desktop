;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	var $header = $('.site-banner');
	var $homeSlider = $('.slider-images .slides');
	var animatedElements = '.block.edito, .section-tertiary, .block.news .caroufredsel_wrapper, .block.participants, .section-partners, .slider-feeds, .contacts-list, .members, .list-articles, .article-title, .article-wrapper .article-intro, .article-wrapper .article-content, body.article_list .list-articles .la-item, .article-alt';
	var rhomboids = '.block.comite .gla-item > a, .rhomboid-container, .edito-image-secondary';
	var members = [];
	var $member = $('.block.comite .gla-item');
	var $membersContainer = $('.block.comite .grid-la-list');
	var $feedsContainer = $('#feeds');
	var wrappedRhomboids = '.article-title .at-illust';

	// Fix header
	function fixHeader(winST) {
		$header.toggleClass('header-collapsed', winST > 0);
	}

	// Videos
	function startVideos() {
		$('[id^="video"]').each(function(){
			

			var $video = $(this);
			var $playBtn = $video.data('playbtn') != true ? $($video.data('playbtn')) : $video.closest('.la-item-video').find('.play-btn');
			var player = new YT.Player($video.get(0), {
				videoId: $video.data('video'),
				events: {
					onStateChange: function(state) {
						if (state.data == 0 && $video.data('autohide') && $('.slider-images').length) {
							updateSlider();
						}

						if (state.data == 0 && $playBtn.length && $playBtn.closest('.is-playing')) {
							$playBtn
								.closest('.is-playing')
									.removeClass('is-playing');
						}
					}
				}
			});

			if ($video.data('playbtn')) {
				$playBtn.on('click', function(e){
					e.preventDefault();
					e.stopPropagation();

					var $this = $(this);

					$this
						.parent()
						.addClass('is-playing');

					if ($this.closest('.slider-images')) {
						$homeSlider
							.parent()
								.addClass('is-hidden');
					}

					player.playVideo();
				});

				$('.video-stop').on('click', function(e){
					e.preventDefault();

					player.stopVideo();

					updateSlider();
				});

				$doc.on('click', function(event) {
					if( !$(event.target) === '#video' || !$(event.target).closest('#video').length ) {
						player.stopVideo();

						updateSlider();	
					}
				});
			}
		});




	}

	// maj home slider
	function updateSlider() {
		$homeSlider
			.parent()
				.removeClass('is-hidden');

		$homeSlider.trigger('slideTo', 0);
	}
	// Animate elements
	function animate(winST) {
		$(animatedElements).each(function(){
			var $this = $(this);

			if (winST + ($win.outerHeight() / 1.2) > $this.offset().top) {
				$this.addClass('animated');
			} else {
				$this.removeClass('animated');
			}

			if (winST + ($win.outerHeight() / 2) > $this.offset().top + $this.outerHeight()) {
				$this.addClass('animated-out');
			} else {
				$this.removeClass('animated-out');
			}
		});
	}



	// Home comite members
	function randomizeMembers() {
		for (var i = 0; i < $member.length; i++) {
			members.push($member.eq(i).clone());
		}

		for (var i = 0; i < 3; i++) {
			$membersContainer.prepend('<div class="gla-item-container"/>');

			$membersContainer.find('> .gla-item:last-child').prependTo($membersContainer.find('.gla-item-container:first-child'));
		}

		$membersContainer
			.find('.gla-item-container .gla-item')
			.addClass('is-shown');

		var i = 0;

		setInterval(function() {
			if (i >= 3) {
				i = 0;

				$membersContainer
					.find('.gla-item-container > :first-child')
					.remove();

				members.sort(function() {
					return 0.5 - Math.random();
				});
			}

			$membersContainer
				.find('.gla-item-container')
				.eq(i)
				.append(members[i].clone());
			$membersContainer
				.find('.gla-item-container')
				.eq(i)
				.removeClass('is-animated');

			setTimeout(function() {
				$membersContainer
					.find('.gla-item-container')
					.eq(i)
					.find('.gla-item:last-child')
					.addClass('is-shown');
				$membersContainer
					.find('.gla-item-container')
					.eq(i)
					.addClass('is-animated');
				i++;
			}, 20);
		}, 1200);
	}

	// Stop default sliders
	function stopSlider($slider) {
		var $sliderClone = $slider.clone();
		var $sliderParent = $slider.parent();

		$sliderClone.attr('style', '');
		$slider.remove();
		$sliderParent
			.after($sliderClone)
			.remove();

		return $sliderClone;
	}

	// Home page sliders
	function prepareSlider($slider) {
		$slider = stopSlider($slider);
		$slider.before('<div class="slider-paging"/>');
		$slider
			.find('.la-item-img')
				.wrap('<div class="la-item-img-container"/>');

		startSlider($slider, {
			width: '100%',
			responsive: true,
			items: 1,
			scroll: { 
				fx: 'fade',
				duration: 600,
				onBefore: function() {
					$slider.find('.la-item').removeClass('active');
				},
				onAfter: function() {
					$slider.find('.la-item:first-child').addClass('active');
				}
			},
			pagination: {
				container: $slider.prev()
			},
			auto: false,
			infinite: true,
			onCreate: function() {
				$slider.find('.la-item:first-child').addClass('active');

				if( $('.play-btn-alt').length ) {
					// Open Video in Modal
					$('.play-btn-alt').magnificPopup({
						type: 'iframe',
						removalDelay: 400,
						mainClass: 'mfp-fade'
					});					
				}
			}
		});
	}

	function fixRhomboids() {
		$(rhomboids).each(function(){
			var $this = $(this);

			$this.outerHeight($this.outerWidth());
		});
	}

	

	// Start sliders
	function startSlider($slider, options) {
		$slider.carouFredSel(options);
	}

	// Scrollbar width
	function getScrollbarWidth() {
	    var outer = document.createElement("div");
	    outer.style.visibility = "hidden";
	    outer.style.width = "100px";
	    outer.style.msOverflowStyle = "scrollbar"; 
	
	    document.body.appendChild(outer);
	
	    var widthNoScroll = outer.offsetWidth;
	    outer.style.overflow = "scroll";
	
	    var inner = document.createElement("div");
	    inner.style.width = "100%";
	    outer.appendChild(inner);        
	
	    var widthWithScroll = inner.offsetWidth;
	
	    outer.parentNode.removeChild(outer);
	
	    return widthNoScroll - widthWithScroll;
	}

	// Fix view for all browsers
	function fixView() {
		var scrollBarWidth = getScrollbarWidth();

		$('.site-banner').css({
			'right': -scrollBarWidth
		});

		$('.nav').css({
			'paddingRight': scrollBarWidth
		});

		$('.global-wrapper').css({
			'marginRight': -scrollBarWidth
		});

		$('.site-footer').css({
			'marginRight': -scrollBarWidth
		});
	}

	// Move pg items into containers
	
	function fixPgItems($container) {
		var $items = $container.find('.pg-item');

		$items
			.each(function(){
				var $this = $(this);
				var $parent = $this.parent();
				var indx = $this.index();

				if (!(indx % 10) || indx == 0) {
					$parent.append('<div class="slide"></div>');
				}

				$this
					.clone()
					.appendTo($parent.find('.slide:last-child'));
			});

		$items.remove();
	}

	// Detection MacOS
	if (navigator.appVersion.indexOf("Mac")!=-1) {
		$('body').addClass('is-mac');
	}	

	// Randomize members
	if ($membersContainer.length) {
		randomizeMembers();
	}

	

	// Wrap rhomboids
	$(wrappedRhomboids).wrap('<div class="rhomboid-container"><div class="rhomboid-container-inner"></div></div>');

	// Fix View
	fixView();

	if ($('.front .list-articles.comite').length) {
		$('.list-articles.comite').append('<span class="circle" data-bottom-top="transform: translate(0, 20.25vw);" data-top-bottom="transform: translate(0, -20.25vw);" data-anchor-target=".list-articles.comite"></span>')
		
		$('.event')
			.detach()
			.prependTo('.list-articles.comite .inside');
	}
	
	if ($('.front .list-articles.participants').length) {
			
		$('.la-item-video')
			.detach()
			.prependTo('.list-articles.participants');
	}

	$doc.on('click', '.btn-up', function(e) {
		e.preventDefault();

		$('html, body').animate({
			scrollTop: 0
		})
	})

	$doc.on('click', '.btn-burger', function(e) {
		e.preventDefault();

		$(this).toggleClass('active')
		$('.site-banner').toggleClass('active')
	})


	$win.on('load', function(){
		if ( $('.section-primary').length ) {
			$('.section-primary .section-inner').css( 'background-image', 'url( ' + $('.section-primary img').attr('src')  + ' )' )
		}

		$('.block.news').append( '<span class="circle skrollable skrollable-between" data-bottom-top="transform: translate(0, 20.25vw);" data-top-bottom="transform: translate(0, -20.25vw);" data-anchor-target=".event"></span>' )

		$('.block.comite .event').append( '<span class="circle-alt skrollable skrollable-between" data-bottom-top="transform: translate(0, 20.25vw);" data-top-bottom="transform: translate(0, -20.25vw);" data-anchor-target=".event"></span>' )

		$('.section-tertiary').append( '<span class="circle-alt skrollable skrollable-between" data-bottom-top="transform: translate(0, 20.25vw);" data-top-bottom="transform: translate(0, -20.25vw);" data-anchor-target=".event"></span>' )

		$('.block.partner.part').append( '<span class="circle-alt skrollable skrollable-between" data-bottom-top="transform: translate(0, 20.25vw);" data-top-bottom="transform: translate(0, -20.25vw);" data-anchor-target=".event"></span>' )

		$('.section-primary .section-inner').append( '<span class="circle-alt skrollable skrollable-between" data-bottom-top="transform: translate(0, 20.25vw);" data-top-bottom="transform: translate(0, -20.25vw);" data-anchor-target=".section-primary"></span>' )

		$('.section .socials').clone().appendTo('.header-body')
		

		if ( $win.width() > 1024 ) {
			skrollr.init();
		} else {
			skrollr.init().destroy();
		}

		if ( $('#zone2 .la-slider').length ) {
			var timer;
			var timer2;

		    $('#zone2 > .block:first-child').addClass('main-slider');
		    var $sliderMain = $('#zone2 .main-slider').clone();
		    var $sliderMainSlides = $('#zone2 > .block:first-child > .la-slider > .slider-content > .la-item').clone();


		    

		    $('#zone2 > .block:first-child .la-slider').detach();
		    $sliderMainSlides.prependTo('.front #zone2 .main-slider');
			$('#zone2 .main-slider').wrap('<div class="slider-main-outer"></div>');
		    
		    var pagingSize = $sliderMain.find('.slider-item').length;
		    var $sliderPaging = '<ol class="slider-paging"></ol>';
		    
		    $($sliderPaging).appendTo($('.slider-main-outer'));

		    $('<div class="slider-paging-hidden"></div>').appendTo($('.slider-main-outer'));
		    $('#zone2 .main-slider .swiper-wrapper').attr('style', '');
		    
		    for (var i = 0; i < pagingSize; i++) {
		        var index = i + 1;
		        if (index < 10) {
		            index = '0' + index;
		        }
		        $('<li><a href="#">' + index + '</a></li>').appendTo($('#zone2 .slider-main-outer ol.slider-paging'));
		    }
		    
		    setTimeout(function() {
		        $('.main-slider').carouFredSel({
		            width: '100%',
		            swipe: true,						
		            swipe: {
		            	onTouch: true
		            },
		            auto: {
		                play: true,
		                timeoutDuration: 7000
		            },
		            pagination: {
		                container: '.slider-main-outer .slider-paging-hidden',
		                anchorBuilder: true
		            },
		            onCreate: function() {
		                var $slider = $(this);
		                
		                timer = setTimeout(function() {
		                    $slider.addClass('animate-slide-out');
		                }, 5700);

		                setTimeout(function() {
		                    $slider.addClass('animate-slide-in');
		                    var idx = $('.slider-main-outer .slider-paging-hidden .selected').index();
		                    $('.slider-main-outer').find('.slider-paging li').eq(idx).addClass('active');
		                }, 500);
		               
		                $('.slider-main-outer .slider-paging a').on('click', function(event) {
		                    event.preventDefault();

		                    var index = $(this).parent().index();
		                    $(this).parent().addClass('active').siblings().removeClass('active');
		                    $slider.addClass('animate-slide-out');
		                    setTimeout(function() {
		                        $slider.trigger('slideTo', index);
		                    }, 1200);
		                });

		                $(window).on('resize', function () {
	                           $slider.parent().height($slider.children().first().height())
	                       })
		            },
		            scroll: {
		                fx: 'crossfade',
		                duration: 0,
		                pauseOnHover: false,
		                onBefore: function() {
		                    var $slider = $(this);
		                	clearTimeout(timer);
		                	clearTimeout(timer2);
		                	$slider.removeClass('animate-slide-out animate-slide-in');
		                },
		                onAfter: function() {
		                    var $slider = $(this);

		                	setTimeout(function() {
		                	    var idx = $('.slider-main-outer .slider-paging-hidden .selected').index();
		                	    $('.slider-main-outer').find('.slider-paging li').eq(idx).addClass('active').siblings().removeClass('active');
		                	    $slider.addClass('animate-slide-in');
		                	}, 500);
		                	timer2 = setTimeout(function() {
		                	    $slider.addClass('animate-slide-out');
		                	}, 5700);


		                }
		            }
		        });

		        $('.main-slider').addClass('loaded');
		    }, 10);
		}


		if ($homeSlider.length) {
			startSlider($homeSlider, {
				width: '100%',
				circular: true,
				infinite: true,
				responsive: true,
				swipe: true,						
				auto: 4000,
				swipe: {
					onTouch: true
				},
				scroll: {
					duration: 1000,
					easing: 'linear',
					fx: 'crossfade'
				},
				items: 1,
				onCreate: function() {
					$homeSlider
						.closest('.slider-images')
						.addClass('loaded');
				}
			});
		}

		if ($('.slider-partners .slides').length) {
			startSlider($('.slider-partners .slides'), {
				width: '100%',
				circular: true,
				infinite: true,
				responsive: true,
				swipe: true,						
				auto: 5000,
				swipe: {
					onTouch: true
				},
				pagination: {
					container: $('.slider-partners .slides').next()
				},
				scroll: {
					duration: 1000
				},
				items: 1
			});
		}

		if ($('.block.news .slider-content').length) {
			prepareSlider($('.block.news .slider-content'));
		}

		if ($('.partner.part').length) {
			fixPgItems($('.partner.part'));

			prepareSlider($('.partner.part .slider-content'));
		}

		if ($('.partner.sponsor').length) {
			fixPgItems($('.partner.sponsor'));

			prepareSlider($('.partner.sponsor .slider-content'));
		}

		if ($('.block.participants .slider-content').length) {
			prepareSlider($('.block.participants .slider-content'));
		}

		if ($('.block.block-page .slider-content').length) {
			// updateMainSlider()
		}

		if ($feedsContainer.length) {
			startSlider($feedsContainer, {
				width: '100%',
				circular: true,
				infinite: true,
				responsive: true,
				swipe: true,						
				auto: 6000,
				swipe: {
					onTouch: true
				},
				pagination: {
					container: $feedsContainer.next()
				},
				scroll: {
					duration: 1000,
					fx: 'fade'
				},
				prev: {
					button: $feedsContainer.parent().find('.slider-prev')
				},
				next: {
					button: $feedsContainer.parent().find('.slider-next')
				},
				items: 1
			});
		}

		if ($('[id^="video"]')) {
			startVideos();
		}

		if( $('.list-articles.news').length ) {
			$('.list-articles.news .la-item-img').wrap('<div class="la-item-img-outer"></div>');
		}

	}).on('load scroll', function(){
		var winST = $win.scrollTop();

		fixHeader(winST);

		animate(winST);

		$('.section-primary .section-inner').css('background-position', 'center ' + ((winST*.3)) + 'px');

	}).on('load resize', function(){
		fixRhomboids();
	});
})(jQuery, window, document);
