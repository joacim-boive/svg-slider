define(function () {
	return {
		handler: function (url, callback) {
			var head = document.querySelector('head');
			var script = document.createElement('script');

			script.async = true;
			script.src = url;
			script.onload = callback;

			head.appendChild(script);
		}
	};
});