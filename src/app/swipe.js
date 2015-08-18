var swipe = (function(){
	var touches = {
		"touchstart": {"x":-1, "y":-1},
		"touchmove" : {"x":-1, "y":-1},
		"touchend"  : false,
			"direction" : "undetermined"
	};

	var handler = function(event) {
		var touch;

		if (typeof event !== 'undefined'){
			event.preventDefault();
			if (typeof event.touches !== 'undefined') {
				touch = event.touches[0];
				switch (event.type) {
					case 'touchstart':
					case 'touchmove':
						touches[event.type].x = touch.pageX;
						touches[event.type].y = touch.pageY;
						break;
					case 'touchend':
						touches[event.type] = true;
						if (touches.touchstart.x > -1 && touches.touchmove.x > -1) {
							touches.direction = touches.touchstart.x < touches.touchmove.x ? "right" : "left";

							// DO STUFF HERE
							alert(touches.direction);
						}
						break;
					default:
						break;
				}
			}
		}
	};

	var init = function() {
		if (('ontouchstart' in window) ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0)) {
			document.addEventListener('touchstart', handler, false);
			document.addEventListener('touchmove', handler, false);
			document.addEventListener('touchend', handler, false);
		}
	};

	return {init: init};

})();

swipe.init();
