define(function () {
	var supportsAnimation = false;
	var prefixes = 'webkit moz o ms'.split(' ');
	var prefix = '';
	var elm = document.createElement('div');

	if (elm.style.animationName !== undefined) {
		supportsAnimation = true;
	}

	if (!supportsAnimation) {
		for (var i = 0, prefixesLen = prefixes.length; i < prefixesLen; i++) {
			if (elm.style[prefixes[i] + 'AnimationName'] !== undefined) {
				prefix = prefixes[i];
				supportsAnimation = true;
				break;
			}
		}
	}

	return {

		/**
		 * Handles listener for the animationend-event.
		 * @param arr {Array} Array of elements to process
		 * @param isOn {Boolean} Add or remove listener
		 * @param callback {Object} Callback function to execute on event
		 */

		handler: function (arr, isOn, callback) {
			var obj;

			if(!supportsAnimation){
				return false;
			}

			for (var i = 0, count = arr.length; i < count; i++) {
				obj = arr[i];

				if (isOn) {
					if(prefix !== ''){
						obj.addEventListener(prefix + 'AnimationEnd', callback, false);
					}
					obj.addEventListener('animationend', callback, false);
				} else {
					if(prefix !== ''){
						obj.removeEventListener(prefix + 'AnimationEnd', callback, false);
					}
					obj.removeEventListener('animationend', callback, false);
				}
			}
		},

		isSupported: function(){
			return supportsAnimation;
		},

		fadeIn: function(obj){
			obj.classList.add('fadeIn');

		}
	};
});
