;(function() {
var animationEvents, main;
animationEvents = function () {
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
      if (!supportsAnimation) {
        return false;
      }
      for (var i = 0, count = arr.length; i < count; i++) {
        obj = arr[i];
        if (isOn) {
          if (prefix !== '') {
            obj.addEventListener(prefix + 'AnimationEnd', callback, false);
          }
          obj.addEventListener('animationend', callback, false);
        } else {
          if (prefix !== '') {
            obj.removeEventListener(prefix + 'AnimationEnd', callback, false);
          }
          obj.removeEventListener('animationend', callback, false);
        }
      }
    },
    isSupported: function () {
      return supportsAnimation;
    },
    fadeIn: function (obj) {
      obj.classList.add('fadeIn');
    }
  };
}();
main = function (require) {
  var init = function () {
    var slider = document.querySelector('.slider');
    var slidesNodeList = slider.querySelectorAll('.wrapper .slide');
    //Convert this nodeList to a real array
    var slides = [];
    var slideCount = slidesNodeList.length;
    var slidesLoaded = 0;
    var ticker = document.querySelector('.ticker');
    var timeout = 0;
    var ticks = '';
    var tick = '<li class="tick" data-count><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><path class="center" d="M50 98.5C23.3 98.5 1.5 76.7 1.5 50S23.3 1.5 50 1.5 98.5 23.3 98.5 50 76.7 98.5 50 98.5z"/><path class="border" d="M50 3c26 0 47 21 47 47S76 97 50 97 3 76 3 50 24 3 50 3m0-3C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0z"/></g></svg></li>';
    //var swipe = require('./swipe');
    var thisAnimationEvents = animationEvents;
    for (var j = 0; j < slideCount; j++) {
      //convert nodeList to a proper array
      //http://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
      slides.push(slidesNodeList[j]);
    }
    slidesNodeList = null;
    function numberOfLoadedSlides() {
      return document.querySelectorAll('.slider .slide[data-is-loaded]').length;
    }
    slidesLoaded = numberOfLoadedSlides();
    function doRun(obj) {
      var that = obj.animationName ? this : obj;
      var previousSlide = document.querySelector('.slider .slide.show');
      if (previousSlide) {
        previousSlide.classList.remove('show');
      }
      that.classList.add('show');
      that.classList.remove('fadeIn');
      timeout = setTimeout(function () {
        var next = that.nextElementSibling || slides[0];
        thisAnimationEvents.fadeIn(next);
        document.querySelector('.tick.active').classList.remove('active');
        ticks[parseInt(next.getAttribute('data-count'))].classList.add('active');
        if (!thisAnimationEvents.isSupported()) {
          doRun(next);
        }
      }, 5000);
    }
    function showTick(event) {
      var obj = event.target || event.srcElement;
      var thisTick = obj.closest('li');
      var thisSlide;
      for (var i = 0; i < slideCount; i++) {
        thisSlide = slides[i];
        thisSlide.className = 'slide animated';
      }
      slides[parseInt(thisTick.getAttribute('data-count'), 10)].classList.add('show');
      document.querySelector('.tick.active').classList.remove('active');
      thisTick.classList.add('active');
    }
    function setMouseEvents() {
      slider.addEventListener('mouseover', function hoverOn() {
        clearTimeout(timeout);
        thisAnimationEvents.handler(slides, false, doRun);
      });
      slider.addEventListener('mouseout', function hoverOff(event) {
        var isShown;
        var isAnimating;
        var next;
        var e = event || window.event;
        var el = e.toElement || e.currentTarget;
        var elLocalName = '';
        if (!el) {
          return;
        }
        elLocalName = el.localName;
        if (!elLocalName) {
          return;
        }
        if (elLocalName === 'svg' || elLocalName === 'object' || elLocalName === 'path') {
          return;
        }
        //We can't cache this as we need the fresh each time
        isShown = document.querySelector('.slider .wrapper .show');
        isAnimating = document.querySelector('.slider .wrapper .fadeIn');
        thisAnimationEvents.handler(slides, true, doRun);
        if (isAnimating) {
          isAnimating.classList.add('show');
          isAnimating.classList.remove('fadeIn');
          if (isShown) {
            isShown.classList.remove('show');
          }
          next = isAnimating;
          doRun(isAnimating);
        } else {
          next = isShown.nextElementSibling || slides[0];
          if (thisAnimationEvents.isSupported()) {
            thisAnimationEvents.fadeIn(next);
          } else {
            doRun(next);
          }
        }
        document.querySelector('.tick.active').classList.remove('active');
        ticks[parseInt(next.getAttribute('data-count'), 10)].classList.add('active');
      });
    }
    function doFadeIn() {
      var placeholder = document.querySelector('.slider img.placeholder');
      var placeholderHeight = placeholder.offsetHeight || '0';
      var placeholderParent = placeholder.parentNode;
      placeholderParent.style.setProperty('min-height', placeholderHeight + 'px', '');
      //placeholder.setAttribute('hidden', 'true');
      slides.forEach(function (thisSlide) {
        thisSlide.classList.remove('visuallyhidden');
      });
      if (placeholder.remove) {
        placeholder.remove();
      } else {
        placeholder.parentNode.removeChild(placeholder);
      }
      setMouseEvents();
      //Don't set mouse events until it's loaded, otherwise we might get errors
      thisAnimationEvents.fadeIn(slides[0]);
      thisAnimationEvents.fadeIn(ticker);
      if (!thisAnimationEvents.isSupported()) {
        doRun(slides[0]);
        ticker.classList.add('show');
      }
    }
    //Check if the sliders are already loaded, if not - wait
    for (var index = 0; index < slideCount; index++) {
      ticks += tick.replace('data-count', 'data-count="' + index + '"');
      slides[index].setAttribute('data-count', index + '');
      slides[index].classList.add('animated');
      if (slidesLoaded !== slideCount) {
        //noinspection Eslint
        slides[index].addEventListener('load', function svgLoad() {
          //noinspection JSReferencingMutableVariableFromClosure
          if (numberOfLoadedSlides() === slideCount) {
            if (slidesLoaded === slideCount) {
              return false;
            }
            slidesLoaded = slideCount;
            //Only do this once;
            doFadeIn();
          }
        }, false);
      }
    }
    ticker.innerHTML = ticks;
    setTimeout(function () {
      ticks = document.querySelectorAll('.tick');
      if (ticks.length === 0) {
        return console.error('SliderWidget - No slides available!');
      }
      ticker.addEventListener('click', showTick);
      ticks[0].classList.add('active');
      if (numberOfLoadedSlides() === slideCount) {
        doFadeIn();
      }
    }, 0);
    thisAnimationEvents.handler(slides, true, doRun);
  };
  init();
}({});
}());