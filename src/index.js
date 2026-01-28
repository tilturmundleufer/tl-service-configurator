/**
 * Turm & Leufer Service Configurator
 * Main Entry Point
 */

import { CONFIG } from './config.js';
import { getConfigData } from './data/cms-data.js';
import { createStore, createInitialState } from './state/store.js';
import { createReducer } from './state/reducer.js';
import { createWireframeRenderer } from './render/wireframe-renderer.js';
import { createEventHandlers } from './events/handlers.js';
import { createSubmitHandler } from './submission/submit.js';
import { detectBrowserLanguage } from './utils/i18n.js';

/**
 * Initialize the configurator
 * @param {Object} options - Configuration options
 * @returns {Object} Configurator API
 */
function init(options = {}) {
  // Merge options with defaults
  const config = {
    webhookUrl: options.webhookUrl || CONFIG.webhookUrl,
    inactivityTimeout: options.inactivityTimeout || CONFIG.inactivityTimeout,
    defaultLang: options.defaultLang || CONFIG.defaultLang,
    rootSelector: options.rootSelector || CONFIG.selectors.root,
    autoDetectLang: options.autoDetectLang !== false
  };
  
  // Update global config
  CONFIG.webhookUrl = config.webhookUrl;
  CONFIG.inactivityTimeout = config.inactivityTimeout;
  
  // Find root element
  const rootElement = document.querySelector(config.rootSelector);
  
  if (!rootElement) {
    console.error(`TL Configurator: Root element not found (${config.rootSelector})`);
    return null;
  }
  
  // Load CMS data
  const configData = getConfigData();
  
  // Detect language
  let initialLang = config.defaultLang;
  if (config.autoDetectLang) {
    initialLang = detectBrowserLanguage(config.defaultLang);
  }
  
  // Create initial state
  const initialState = createInitialState(initialLang);
  
  // Create reducer with config data
  const reducer = createReducer(configData, initialState);
  
  // Create store
  const store = createStore(reducer, initialState);
  
  // Create submit handler
  const submitHandler = createSubmitHandler(store, configData, config.webhookUrl);
  
  // Create renderer (wireframe mode)
  const renderer = createWireframeRenderer(rootElement, store, configData);
  
  // Create event handlers
  const eventHandlers = createEventHandlers(rootElement, store, configData, submitHandler);
  
  // Subscribe renderer to state changes
  store.subscribe((newState, prevState, action) => {
    renderer.render(newState, prevState, action);
  });
  
  // Initialize components
  renderer.init();
  eventHandlers.init();
  
  // Performance mark
  if (typeof performance !== 'undefined') {
    performance.mark('tl-configurator-ready');
  }
  
  console.log('TL Configurator initialized', {
    lang: initialLang,
    services: configData.services.length
  });
  
  // Return public API
  return {
    /**
     * Get current state
     */
    getState: () => store.getState(),
    
    /**
     * Get configuration data
     */
    getConfigData: () => configData,
    
    /**
     * Set language
     */
    setLang: (lang) => {
      if (lang === 'de' || lang === 'en') {
        store.dispatch({ type: 'SET_LANG', payload: { lang } });
      }
    },
    
    /**
     * Reset the configurator
     */
    reset: () => {
      store.dispatch({ type: 'RESET' });
    },
    
    /**
     * Destroy the configurator
     */
    destroy: () => {
      eventHandlers.destroy();
      rootElement.innerHTML = '';
    },
    
    /**
     * Manually trigger submission
     */
    submit: () => submitHandler(store.getState())
  };
}

// Export for ES modules
export { init };

// Expose global API for script tag usage
if (typeof window !== 'undefined') {
  window.TLConfigurator = { init };
}

export default { init };
