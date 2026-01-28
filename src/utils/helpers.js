/**
 * Utility Helper Functions
 */

/**
 * Generate a UUID v4
 * @returns {string} UUID string
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Debounce a function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle a function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Safely get nested property from object
 * @param {Object} obj - Object to query
 * @param {string} path - Dot-notation path
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Value at path or default
 */
export function get(obj, path, defaultValue = undefined) {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

/**
 * Deep clone an object (with Set support)
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Set) return new Set([...obj]);
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Wait for a specified duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Request animation frame with promise
 * @returns {Promise} Promise that resolves on next animation frame
 */
export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Parse a remove target string
 * @param {string} target - Target string (e.g., "service:webdesign" or "addon:webdesign:blog")
 * @returns {Object} Parsed target object
 */
export function parseRemoveTarget(target) {
  const parts = target.split(':');
  
  if (parts[0] === 'service') {
    return {
      type: 'service',
      serviceSlug: parts[1]
    };
  }
  
  if (parts[0] === 'addon') {
    return {
      type: 'addon',
      serviceSlug: parts[1],
      addonSlug: parts[2]
    };
  }
  
  return null;
}

/**
 * Check if element matches selector
 * @param {Element} element - DOM element
 * @param {string} selector - CSS selector
 * @returns {boolean} Whether element matches
 */
export function matches(element, selector) {
  return element && element.matches && element.matches(selector);
}

/**
 * Find closest ancestor matching selector (including self)
 * @param {Element} element - Starting element
 * @param {string} selector - CSS selector
 * @returns {Element|null} Matching ancestor or null
 */
export function closest(element, selector) {
  return element && element.closest ? element.closest(selector) : null;
}

/**
 * Create a DocumentFragment from HTML string
 * @param {string} html - HTML string
 * @returns {DocumentFragment} Document fragment
 */
export function htmlToFragment(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
}

/**
 * Get or create a session ID
 * @returns {string} Session ID
 */
export function getOrCreateSessionId() {
  const key = 'tl-configurator-session';
  let id = sessionStorage.getItem(key);
  
  if (!id) {
    id = generateUUID();
    sessionStorage.setItem(key, id);
  }
  
  return id;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} Whether reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Serialize state selections for payload (convert Sets to Arrays)
 * @param {Object} selections - State selections object
 * @returns {Object} Serializable selections
 */
export function serializeSelections(selections) {
  const result = {};
  
  for (const [key, value] of Object.entries(selections)) {
    result[key] = {
      ...value,
      addons: [...value.addons]
    };
  }
  
  return result;
}

export default {
  generateUUID,
  debounce,
  throttle,
  get,
  deepClone,
  wait,
  nextFrame,
  escapeHtml,
  parseRemoveTarget,
  matches,
  closest,
  htmlToFragment,
  getOrCreateSessionId,
  prefersReducedMotion,
  serializeSelections
};
