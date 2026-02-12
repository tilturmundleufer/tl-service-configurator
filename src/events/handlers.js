/**
 * Event Handlers - Event delegation and user interaction handling
 */

import { actions } from '../state/reducer.js';
import * as selectors from '../state/selectors.js';
import { parseRemoveTarget, debounce } from '../utils/helpers.js';
import { CONFIG } from '../config.js';

/**
 * Create event handler manager
 * @param {Element} rootElement - Root container element
 * @param {Object} store - State store
 * @param {Object} configData - CMS configuration data
 * @param {Function} onSubmit - Submit callback function
 * @returns {Object} Event handler API
 */
export function createEventHandlers(rootElement, store, configData, onSubmit) {
  let inactivityTimer = null;
  let suggestionTimer = null;
  
  /**
   * Initialize event listeners
   */
  function init() {
    // Main click delegation
    rootElement.addEventListener('click', handleClick);
    
    // Change delegation (for select dropdowns)
    rootElement.addEventListener('change', handleChange);
    
    // Keyboard navigation
    rootElement.addEventListener('keydown', handleKeydown);
    
    // Start inactivity tracking
    startInactivityTimer();
    
    // Track interactions to reset inactivity timer
    rootElement.addEventListener('mousemove', debounce(recordInteraction, 1000), { passive: true });
    rootElement.addEventListener('touchstart', recordInteraction, { passive: true });
  }
  
  /**
   * Handle click events via delegation
   * @param {Event} event - Click event
   */
  function handleClick(event) {
    // Record interaction for inactivity timer
    recordInteraction();
    
    // Find the action element
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;
    
    const action = actionElement.dataset.action;
    
    // Prevent default for buttons
    if (actionElement.tagName === 'BUTTON') {
      event.preventDefault();
    }
    
    switch (action) {
      case 'toggle-service':
        handleToggleService(actionElement);
        break;
        
      case 'expand-service':
        handleExpandService(actionElement);
        break;
        
      case 'collapse-service':
        handleCollapseService(actionElement);
        break;
        
      case 'select-tab':
        handleSelectTab(actionElement);
        break;
        
      case 'set-size':
        handleSetSize(actionElement);
        break;
        
      case 'toggle-addon':
        handleToggleAddon(actionElement);
        break;
        
      case 'remove':
        handleRemove(actionElement);
        break;
        
      case 'submit':
        handleSubmit();
        break;
        
      case 'set-lang':
        handleSetLang(actionElement);
        break;
        
      case 'dismiss-suggestion':
        handleDismissSuggestion();
        break;
        
      case 'retry':
        handleRetry();
        break;
        
      case 'next-step':
        handleNextStep();
        break;
        
      case 'prev-step':
        handlePrevStep();
        break;
        
      case 'toggle-extra-service':
        handleToggleExtraService(actionElement);
        break;
        
      case 'contact':
        handleContact();
        break;
        
      case 'toggle-summary':
        handleToggleSummary(actionElement);
        break;
    }
  }
  
  /**
   * Handle change events (select dropdowns)
   * @param {Event} event - Change event
   */
  function handleChange(event) {
    const el = event.target;
    const action = el.dataset?.action;
    if (action === 'set-size-select') {
      const sizeSlug = el.value;
      const serviceSlug = el.dataset.forService;
      if (sizeSlug && serviceSlug && selectors.isServiceSelected(store.getState(), serviceSlug)) {
        store.dispatch(actions.setSize(serviceSlug, sizeSlug));
      }
    }
  }
  
  /**
   * Handle keyboard navigation
   * @param {Event} event - Keydown event
   */
  function handleKeydown(event) {
    // Enter or Space on buttons
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target;
      if (target.matches('[data-action]') && target.tagName !== 'BUTTON') {
        event.preventDefault();
        handleClick({ target, preventDefault: () => {} });
      }
    }
    
    // Escape to dismiss suggestion
    if (event.key === 'Escape') {
      const state = store.getState();
      if (state.suggestionVisible) {
        store.dispatch(actions.hideSuggestion());
      }
    }
  }
  
  /**
   * Handle service toggle
   * @param {Element} element - Service button element
   */
  function handleToggleService(element) {
    const serviceSlug = element.dataset.service;
    if (!serviceSlug) return;
    
    store.dispatch(actions.toggleService(serviceSlug));
    
    // Clear validation errors when making changes
    store.dispatch(actions.clearValidationErrors());
  }
  
  /**
   * Handle expanding a service (clicking on header to expand/collapse)
   * @param {Element} element - Service button element
   */
  function handleExpandService(element) {
    const serviceSlug = element.dataset.service;
    if (!serviceSlug) return;
    
    store.dispatch(actions.expandService(serviceSlug));
    
    // Clear validation errors when making changes
    store.dispatch(actions.clearValidationErrors());
  }
  
  /**
   * Handle collapsing a service
   * @param {Element} element - Collapse button element
   */
  function handleCollapseService(element) {
    const serviceSlug = element.dataset.service;
    if (!serviceSlug) return;
    
    store.dispatch(actions.collapseService(serviceSlug));
  }
  
  /**
   * Handle selecting a tab (just switches view, doesn't select service)
   * @param {Element} element - Tab button element
   */
  function handleSelectTab(element) {
    const serviceSlug = element.dataset.service;
    if (!serviceSlug) return;
    
    // Use expandService to switch tabs (it sets expandedService)
    store.dispatch(actions.selectTab(serviceSlug));
  }
  
  /**
   * Handle size selection
   * @param {Element} element - Size button element
   */
  function handleSetSize(element) {
    const sizeSlug = element.dataset.size;
    const serviceSlug = element.dataset.forService;
    
    if (!sizeSlug || !serviceSlug) return;
    
    // Check if service is selected
    const state = store.getState();
    if (!selectors.isServiceSelected(state, serviceSlug)) return;
    
    store.dispatch(actions.setSize(serviceSlug, sizeSlug));
    store.dispatch(actions.clearValidationErrors());
  }
  
  /**
   * Handle addon toggle
   * @param {Element} element - Addon button element
   */
  function handleToggleAddon(element) {
    const addonSlug = element.dataset.addon;
    const serviceSlug = element.dataset.forService;
    
    if (!addonSlug || !serviceSlug) return;
    
    // Check if disabled
    if (element.classList.contains('is-disabled') || element.disabled) return;
    
    store.dispatch(actions.toggleAddon(serviceSlug, addonSlug));
  }
  
  /**
   * Handle remove action (from summary chips or build area)
   * @param {Element} element - Remove button element
   */
  function handleRemove(element) {
    const target = element.dataset.target;
    if (!target) return;
    
    const parsed = parseRemoveTarget(target);
    if (!parsed) return;
    
    if (parsed.type === 'service') {
      store.dispatch(actions.removeService(parsed.serviceSlug));
    } else if (parsed.type === 'addon') {
      store.dispatch(actions.removeAddon(parsed.serviceSlug, parsed.addonSlug));
    }
    
    store.dispatch(actions.clearValidationErrors());
  }
  
  /**
   * Handle form submission
   */
  async function handleSubmit() {
    const state = store.getState();
    
    // Don't submit if already submitting
    if (state.isSubmitting) return;
    
    // Validate
    const errors = selectors.getValidationErrors(state, configData);
    
    if (errors.length > 0) {
      store.dispatch(actions.setValidationErrors(errors));
      return;
    }
    
    // Clear any previous errors
    store.dispatch(actions.clearValidationErrors());
    
    // Call the submit handler
    if (onSubmit) {
      await onSubmit(state);
    }
  }
  
  /**
   * Handle language change
   * @param {Element} element - Language button element
   */
  function handleSetLang(element) {
    const lang = element.dataset.lang;
    if (!lang || (lang !== 'de' && lang !== 'en')) return;
    
    store.dispatch(actions.setLang(lang));
  }
  
  /**
   * Handle suggestion dismissal
   */
  function handleDismissSuggestion() {
    store.dispatch(actions.hideSuggestion());
  }
  
  /**
   * Handle retry after error
   */
  function handleRetry() {
    store.dispatch(actions.setSubmitStatus('idle'));
    handleSubmit();
  }
  
  /**
   * Handle step progression (Continue button)
   */
  function handleNextStep() {
    const state = store.getState();
    
    // Validate before moving to next step
    if (state.currentStep === 'configure' || state.currentStep === 'add') {
      const webdesignSelection = state.selections['webdesign'];
      if (!webdesignSelection || !webdesignSelection.size) {
        // Size not selected, don't proceed
        return;
      }
    }
    
    store.dispatch(actions.nextStep());
    store.dispatch(actions.clearValidationErrors());
  }
  
  /**
   * Handle step regression (Back button)
   */
  function handlePrevStep() {
    store.dispatch(actions.prevStep());
  }
  
  /**
   * Handle extra service toggle
   * @param {Element} element - Toggle button element
   */
  function handleToggleExtraService(element) {
    const serviceSlug = element.dataset.extraService;
    if (!serviceSlug) return;
    
    store.dispatch(actions.toggleExtraService(serviceSlug));
  }
  
  /**
   * Handle contact button click
   */
  function handleContact() {
    // Open contact page or modal - can be customized
    window.open('https://turmundleufer.de/kontakt', '_blank');
  }
  
  /**
   * Handle summary panel toggle (mobile accordion)
   * @param {Element} element - Toggle button element
   */
  function handleToggleSummary(element) {
    const summaryPanel = element.closest('[data-summary]');
    if (summaryPanel) {
      summaryPanel.classList.toggle('is-collapsed');
    }
  }
  
  /**
   * Record user interaction (for inactivity timer)
   */
  function recordInteraction() {
    store.dispatch(actions.recordInteraction());
    store.dispatch(actions.hideSuggestion());
    resetInactivityTimer();
  }
  
  /**
   * Start the inactivity timer
   */
  function startInactivityTimer() {
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
      checkAndShowSuggestion();
    }, CONFIG.inactivityTimeout);
  }
  
  /**
   * Reset the inactivity timer
   */
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(suggestionTimer);
    startInactivityTimer();
  }
  
  /**
   * Check state and show appropriate suggestion
   */
  function checkAndShowSuggestion() {
    const state = store.getState();
    
    // Don't show if submitting or already showing
    if (state.isSubmitting || state.suggestionVisible) return;
    
    // Don't show if no services selected
    if (selectors.getSelectedServices(state).length === 0) return;
    
    // Get a suggestion
    const suggestion = selectors.getSuggestion(state, configData);
    
    if (suggestion) {
      store.dispatch(actions.showSuggestion(suggestion));
      
      // Auto-hide after duration
      suggestionTimer = setTimeout(() => {
        store.dispatch(actions.hideSuggestion());
      }, CONFIG.suggestionDuration);
    }
  }
  
  /**
   * Clean up event listeners
   */
  function destroy() {
    rootElement.removeEventListener('click', handleClick);
    rootElement.removeEventListener('change', handleChange);
    rootElement.removeEventListener('keydown', handleKeydown);
    clearTimeout(inactivityTimer);
    clearTimeout(suggestionTimer);
  }
  
  return {
    init,
    destroy,
    recordInteraction,
    resetInactivityTimer
  };
}

export default { createEventHandlers };
