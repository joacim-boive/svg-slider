define(function () {
	/**
	 * Checks if the current browser is any version of IE
	 * @returns {*|boolean}
	 */
	return  window.ActiveXObject || "ActiveXObject" in window;
});
