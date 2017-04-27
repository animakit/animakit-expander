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

export {
  isEqual,
  transitionEventName,
};
