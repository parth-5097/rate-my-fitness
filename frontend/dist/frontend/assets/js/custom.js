$(function() {
	$(document).on("click",".toggle-icon-main", function(e) {
		e.preventDefault();
		$(".dash-wrapper").toggleClass("toggled-custom-class");
	});

	$(document).on("click",".header-user-profile-inner-cust", function(e) {
		$(this).toggleClass("active");
		e.stopPropagation();
	});
	$(document).on("click", function(e) {
		if ($(e.target).closest(".header-user-profile-inner-cust").length > 0)
			return;
		if ($(e.target).is(".header-user-profile-inner-cust") === false) {
			$(".header-user-profile-inner-cust").removeClass("active");
		}
	})
	$(window).on('unload', function() {
		$(window).scrollTop(0);
	})

	$(document).on('click','#pls-icon-click', function() {
		if ($('.pls-ico-inner').hasClass('show-class')) {
			$('.pls-ico-inner').removeClass('show-class');
		} else {
			$('.pls-ico-inner').addClass('show-class');
		}
	})

	var yourNavigation = $(".header-fixed");
	stickyDiv = "header-sticky";
	yourHeader = $('.header-fixed').height();

	$(window).scroll(function () {
		if ($(this).scrollTop() > yourHeader) {
			yourNavigation.addClass(stickyDiv);
		} else {
			yourNavigation.removeClass(stickyDiv);
		}
	});

	$(document).scroll(function () {
		$(this).scrollTop() > 400 ? $(".back-to-top").fadeIn() : $(".back-to-top").fadeOut()
	}), $(".back-to-top").click(function () {
		return $("html, body").animate({
			scrollTop: 0
		}, 1500), !1
	})
})

$(document).ready(function() {
	$(function() {
		$(document).on("click",".menu-togle-new", function(e) {
			$('.header-menu-links-inr').toggleClass("mbl-menu-open-cust");
			if ($(".header-menu-links-inr").hasClass('mbl-menu-open-cust')) {
				$(this).append('<div class="menu-derk-bg-new"></div>');
			} else {
				$("div.menu-derk-bg-new").remove();
			}
			e.stopPropagation();
		});

		$(document).on("click", function(e) {
			if ($(e.target).closest(".header-menu-links-inr").length > 0)
				return;
			if ($(e.target).is(".header-menu-links-inr") === false) {
				$(".header-menu-links-inr").removeClass("mbl-menu-open-cust");
				$("div.menu-derk-bg-new").remove();
			}
		});

		$(document).on("click", function(e) {
			if ($(e.target).closest(".hamburger-menu-cust").length > 0)
				return;
			if ($(e.target).is(".hamburger-menu-cust") === false) {}
		});
	});
});
