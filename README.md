# Slider

Fully responsive, mobile & retina ready gallery/slider library with no external dependecies.

Tested on:

Desktop

- IE9
- IE11
- Chrome 44
- Firefox 40
- Safari 8 on Yosemite

Should work on earlier versions of IE as well, but they lack the SVG support used here.
Note that SVG and the OBJECT-element is not a requirement.

Mobile

- Safari 8 on iOS 8
- UC on Android 4.4 (Samsung Note 3)


Set the limitations on the size of the slides on the div.slider element.
Otherwise it will expand and contract from 100% to 0.


Features

- Waits until all slides are loaded before starting the animation.
- Gracefully fallbacks to just switching between the image if CSS3 animation isn't supported.
- Pauses the animation onMouseOver and moves to the next slide onMouseOut.
- NO layout jumping as the page loads.


TODO

- Add swipe support for touch enabled devices.
- Testing on more browsers and platforms.