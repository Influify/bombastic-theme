//General functions
var transitioning = true;

// Load toggle - toggles the loading classes with slight delays to allow for layout changes
function toggleLoad() {
  if($('body').hasClass('loading') && transitioning) {
    setTimeout( function() {
      $('body').removeClass("loading");
      $('body').addClass("loaded");
      transitioning = false;
    }, 250);
    
  } else {
    $('body').addClass("loading");
    $('body').removeClass("loaded");
    transitioning = true;
  }
}


//to help performance on the scroll event later
function throttle(fn, wait) {
	var time = Date.now();
	return function() {
		if ((time + wait - Date.now()) < 0) {
			fn();
			time = Date.now();
		}
	}
}

// Product page functions
var pageEventsSet = false;
var totalScroll = 0;

//If there's a selection, enable button
function checkSelected() {
	if($('#selected').length) {
		$('#variation-submit').removeClass('disabled');
	} else {
		$('#variation-submit').addClass('disabled');
	}
}

function clearSelection() {
	$('#selected').attr('id','');
	$('.selected').removeClass('selected');
	$('#variation-submit').addClass('disabled');
	$('.selected-price').text("");
}

// Updates selected option size availability
function updateOption(el) {
	if(!$(el).hasClass('unavailable')) {
		clearSelection();
		var sizes = $('.size-array').data("sizes").split(", ");
		
		updateImage(el);
		$('.sizes-container').removeClass('unselected');
		$('.selected-option').removeClass('selected-option');
		el.addClass('selected-option');
		
		sizes.forEach(function(size){
			var currentSize = " ." + size;
			if(el.data(size)) {
				$(currentSize).removeClass('out-of-stock');
				$(currentSize).addClass('in-stock');
				$(currentSize).data('id', $("." + $(el).attr('id')).data(size)); //grab the id of the option selected, assign product ids from samp
				$(currentSize).data('price', $(el).data('price') + ".0");
				
			} else {
				$(currentSize).addClass('out-of-stock');
				$(currentSize).removeClass('in-stock');
				$(currentSize).attr('id','');
				$(currentSize).data('id', ''); //remove data id so wrong variations don't get added
			}
		});
	}
}

// Adds #selected on click, removes old
function selectSize(el) {
	if (!(el.attr('id') == "selected")) { 
		$('#selected').attr('id','');
		$('.selected').removeClass('selected');
		$('#product-details .selector-container a:eq(' + el.index() + ')').attr('id','selected');
		$('#selected').addClass('selected');
		$('.product-quickadd .selector-container a:eq(' + el.index() + ')').addClass('selected');
		$('#variation-submit').removeClass('disabled');
		$('.selected-price').text("$" + $('#selected').data('price') + "0 / ");
		
	} else {
		clearSelection();
	}
}

function initWindow() {
	$("#menu-trigger, .nav-bg").on("click", function (){
		$('body').toggleClass("nav-is-open");
	});	
}

function initPage() {
	if (!pageEventsSet) {
		$('.option-selector').on('click', function(e){
			var $this = $(this);
			updateOption($this);
			checkSelected();
		});
		
		$('.option-selector[href^="#"]').on('click', function (e) {
			e.preventDefault();
		});
		
		$('.size-selector').on('click', function(e){
			var $this = $(this);
			selectSize($this);
		});

		//if product
		$(window).off('scroll');
		$(window).on('scroll', throttle(function () {
			console.log('scrollfire');
			var imageH =  $(this).height() - $('.product-images').height();
			var imageT = this.scrollY - $('.product-images').offset().top;
			
			$('.scroller').scrollTop(imageT / imageH * ($('.scroller').height() - $(this).height()));
		}, 50));
		
		pageEventsSet = true;
	}
}

//Window initialization
$(document).ready(function(){
	initWindow();
	initPage();
	toggleLoad();
});