'use strict';

/**
 * @param {*} div - Name of the div element to get
 *                - Can be either a string (id of the div) or a div element
 * @returns - The div element
 * @throws - If the div element is not found
 */
const getElement = (div) => {
  if (typeof div === 'string') {
    const c = document.getElementById(div);
    if (c === null) {
      throw new Error('<div> element width Id: "' + div + '" not found');
    }
    return c;
  }
  return div;
};

module.exports = getElement;

/* eslint-env browser */
