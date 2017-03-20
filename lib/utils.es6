import isEqual from 'lodash.isequal';

/*
 * Check whether the CSS property supported
 */
function isPropertySupported(name, value) {
  const propName = name;

  const element = document.createElement('p');
  document.body.insertBefore(element, null);

  element.style[propName] = value;

  const propValue = window
    .getComputedStyle(element, null)
    .getPropertyValue(propName);

  document.body.removeChild(element);

  return propValue === value;
}

/*
 * Get CSS transitionend event name
 */
function transitionEventName() {
  if (isPropertySupported('transition', 'opacity 1s')) {
    return 'transitionend';
  }

  return 'webkitTransitionEnd';
}

/*
 * animationFrame polyfill
 */
function animationFramePolyfill(){
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];

  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame']
                                || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      const currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      window.clearTimeout(id);
    };
  }
}

export {
  isEqual,
  transitionEventName,
  animationFramePolyfill,
};
