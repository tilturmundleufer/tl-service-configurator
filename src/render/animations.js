/**
 * Animation Helpers - Smooth, performant animations
 */

import { prefersReducedMotion, nextFrame } from '../utils/helpers.js';

/**
 * Animation class names
 */
export const AnimationClasses = {
  POP_ENTER: 'tl-anim-pop-enter',
  POP_EXIT: 'tl-anim-pop-exit',
  FADE_ENTER: 'tl-anim-fade-enter',
  FADE_EXIT: 'tl-anim-fade-exit',
  SLIDE_DOWN_ENTER: 'tl-anim-slide-down-enter',
  SLIDE_UP_EXIT: 'tl-anim-slide-up-exit',
  STAGGER: 'tl-anim-stagger',
  SHAKE: 'tl-anim-shake'
};

/**
 * Default animation durations (ms)
 */
export const Durations = {
  POP: 300,
  FADE: 200,
  SLIDE: 250,
  STAGGER_DELAY: 50,
  SHAKE: 400
};

/**
 * Check if animations should be reduced
 * @returns {boolean} Whether to reduce animations
 */
export function shouldReduceMotion() {
  return prefersReducedMotion();
}

/**
 * Apply enter animation to an element
 * @param {Element} element - Target element
 * @param {string} type - Animation type ('pop', 'fade', 'slide')
 * @param {number} delay - Delay before animation starts (ms)
 * @returns {Promise} Promise that resolves when animation completes
 */
export function animateEnter(element, type = 'pop', delay = 0) {
  if (shouldReduceMotion()) {
    element.style.opacity = '1';
    return Promise.resolve();
  }
  
  return new Promise(resolve => {
    const className = {
      pop: AnimationClasses.POP_ENTER,
      fade: AnimationClasses.FADE_ENTER,
      slide: AnimationClasses.SLIDE_DOWN_ENTER
    }[type] || AnimationClasses.POP_ENTER;
    
    const duration = {
      pop: Durations.POP,
      fade: Durations.FADE,
      slide: Durations.SLIDE
    }[type] || Durations.POP;
    
    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }
    
    element.classList.add(className);
    
    const onEnd = () => {
      element.classList.remove(className);
      element.style.animationDelay = '';
      resolve();
    };
    
    element.addEventListener('animationend', onEnd, { once: true });
    
    // Fallback timeout in case animationend doesn't fire
    setTimeout(onEnd, duration + delay + 50);
  });
}

/**
 * Apply exit animation to an element and optionally remove it
 * @param {Element} element - Target element
 * @param {string} type - Animation type ('pop', 'fade', 'slide')
 * @param {boolean} removeAfter - Whether to remove element after animation
 * @returns {Promise} Promise that resolves when animation completes
 */
export function animateExit(element, type = 'pop', removeAfter = true) {
  if (shouldReduceMotion()) {
    if (removeAfter) {
      element.remove();
    } else {
      element.style.opacity = '0';
    }
    return Promise.resolve();
  }
  
  return new Promise(resolve => {
    const className = {
      pop: AnimationClasses.POP_EXIT,
      fade: AnimationClasses.FADE_EXIT,
      slide: AnimationClasses.SLIDE_UP_EXIT
    }[type] || AnimationClasses.POP_EXIT;
    
    const duration = {
      pop: Durations.POP,
      fade: Durations.FADE,
      slide: Durations.SLIDE
    }[type] || Durations.POP;
    
    element.classList.add(className);
    
    const onEnd = () => {
      if (removeAfter) {
        element.remove();
      } else {
        element.classList.remove(className);
      }
      resolve();
    };
    
    element.addEventListener('animationend', onEnd, { once: true });
    setTimeout(onEnd, duration + 50);
  });
}

/**
 * Animate multiple elements with staggered timing
 * @param {Element[]} elements - Array of elements to animate
 * @param {string} type - Animation type
 * @param {number} staggerDelay - Delay between each element (ms)
 * @returns {Promise} Promise that resolves when all animations complete
 */
export function animateStaggered(elements, type = 'pop', staggerDelay = Durations.STAGGER_DELAY) {
  if (shouldReduceMotion()) {
    elements.forEach(el => el.style.opacity = '1');
    return Promise.resolve();
  }
  
  const promises = elements.map((element, index) => {
    return animateEnter(element, type, index * staggerDelay);
  });
  
  return Promise.all(promises);
}

/**
 * Apply shake animation to indicate error/validation
 * @param {Element} element - Target element
 * @returns {Promise} Promise that resolves when animation completes
 */
export function animateShake(element) {
  if (shouldReduceMotion()) {
    // Flash the element instead
    element.style.transition = 'background-color 0.1s';
    element.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    setTimeout(() => {
      element.style.backgroundColor = '';
    }, 200);
    return Promise.resolve();
  }
  
  return new Promise(resolve => {
    element.classList.add(AnimationClasses.SHAKE);
    
    const onEnd = () => {
      element.classList.remove(AnimationClasses.SHAKE);
      resolve();
    };
    
    element.addEventListener('animationend', onEnd, { once: true });
    setTimeout(onEnd, Durations.SHAKE + 50);
  });
}

/**
 * Smoothly expand an element from 0 height
 * @param {Element} element - Target element
 * @returns {Promise} Promise that resolves when animation completes
 */
export async function animateExpand(element) {
  if (shouldReduceMotion()) {
    element.style.height = 'auto';
    element.style.overflow = '';
    return;
  }
  
  // Get the natural height
  element.style.height = 'auto';
  element.style.overflow = 'hidden';
  const naturalHeight = element.offsetHeight;
  
  // Start from 0
  element.style.height = '0';
  
  await nextFrame();
  
  // Animate to natural height
  element.style.transition = 'height 0.3s ease-out';
  element.style.height = `${naturalHeight}px`;
  
  return new Promise(resolve => {
    const onEnd = () => {
      element.style.height = 'auto';
      element.style.overflow = '';
      element.style.transition = '';
      resolve();
    };
    
    element.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(onEnd, 350);
  });
}

/**
 * Smoothly collapse an element to 0 height
 * @param {Element} element - Target element
 * @param {boolean} removeAfter - Whether to remove element after
 * @returns {Promise} Promise that resolves when animation completes
 */
export async function animateCollapse(element, removeAfter = true) {
  if (shouldReduceMotion()) {
    if (removeAfter) {
      element.remove();
    } else {
      element.style.height = '0';
      element.style.overflow = 'hidden';
    }
    return;
  }
  
  const currentHeight = element.offsetHeight;
  element.style.height = `${currentHeight}px`;
  element.style.overflow = 'hidden';
  
  await nextFrame();
  
  element.style.transition = 'height 0.25s ease-in, opacity 0.2s ease-in';
  element.style.height = '0';
  element.style.opacity = '0';
  
  return new Promise(resolve => {
    const onEnd = () => {
      if (removeAfter) {
        element.remove();
      }
      resolve();
    };
    
    element.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(onEnd, 300);
  });
}

/**
 * Add visual pulse effect
 * @param {Element} element - Target element
 */
export function animatePulse(element) {
  if (shouldReduceMotion()) return;
  
  element.style.transition = 'transform 0.15s ease-out';
  element.style.transform = 'scale(1.05)';
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
    }, 150);
  }, 150);
}

/**
 * Create CSS animation keyframes and inject them
 * Call this once on initialization
 */
export function injectAnimationStyles() {
  const styleId = 'tl-configurator-animations';
  
  // Don't inject twice
  if (document.getElementById(styleId)) return;
  
  const css = `
    /* Pop Enter */
    @keyframes tlPopIn {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    /* Pop Exit */
    @keyframes tlPopOut {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    
    /* Fade Enter */
    @keyframes tlFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Fade Exit */
    @keyframes tlFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    /* Slide Down Enter */
    @keyframes tlSlideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Slide Up Exit */
    @keyframes tlSlideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    
    /* Shake */
    @keyframes tlShake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    
    /* Animation Classes */
    .${AnimationClasses.POP_ENTER} {
      animation: tlPopIn ${Durations.POP}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    .${AnimationClasses.POP_EXIT} {
      animation: tlPopOut ${Durations.POP * 0.66}ms ease-out forwards;
    }
    
    .${AnimationClasses.FADE_ENTER} {
      animation: tlFadeIn ${Durations.FADE}ms ease-out forwards;
    }
    
    .${AnimationClasses.FADE_EXIT} {
      animation: tlFadeOut ${Durations.FADE}ms ease-in forwards;
    }
    
    .${AnimationClasses.SLIDE_DOWN_ENTER} {
      animation: tlSlideDown ${Durations.SLIDE}ms ease-out forwards;
    }
    
    .${AnimationClasses.SLIDE_UP_EXIT} {
      animation: tlSlideUp ${Durations.SLIDE}ms ease-in forwards;
    }
    
    .${AnimationClasses.SHAKE} {
      animation: tlShake ${Durations.SHAKE}ms ease-in-out;
    }
    
    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .${AnimationClasses.POP_ENTER},
      .${AnimationClasses.POP_EXIT},
      .${AnimationClasses.FADE_ENTER},
      .${AnimationClasses.FADE_EXIT},
      .${AnimationClasses.SLIDE_DOWN_ENTER},
      .${AnimationClasses.SLIDE_UP_EXIT},
      .${AnimationClasses.SHAKE} {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  AnimationClasses,
  Durations,
  shouldReduceMotion,
  animateEnter,
  animateExit,
  animateStaggered,
  animateShake,
  animateExpand,
  animateCollapse,
  animatePulse,
  injectAnimationStyles
};
