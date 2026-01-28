/**
 * Main Renderer - Manages DOM updates based on state changes
 */

import { CONFIG } from '../config.js';
import { t, getLocalizedName, updateAllTranslations } from '../utils/i18n.js';
import * as selectors from '../state/selectors.js';
import { canAddAddon } from '../state/reducer.js';
import {
  createFallbackTemplates,
  createServiceCard,
  createServiceBuild,
  createSizeButton,
  createPageCards,
  createModuleCards,
  createAddonButton,
  createAddonVisual,
  createSummaryChip,
  createSuggestionToast
} from './templates.js';
import {
  animateEnter,
  animateExit,
  animateStaggered,
  animateExpand,
  animateCollapse,
  animateShake,
  injectAnimationStyles
} from './animations.js';

/**
 * Create the renderer
 * @param {Element} rootElement - Root container element
 * @param {Object} store - State store
 * @param {Object} configData - CMS configuration data
 * @returns {Object} Renderer API
 */
export function createRenderer(rootElement, store, configData) {
  // Cache DOM element references
  let elements = {};
  
  /**
   * Initialize the renderer - build initial DOM structure
   */
  function init() {
    // Inject animation styles
    injectAnimationStyles();
    
    // Create fallback templates if not in Webflow
    createFallbackTemplates();
    
    // Build the initial DOM structure
    buildInitialStructure();
    
    // Cache element references
    cacheElements();
    
    // Initial render
    render(store.getState(), null);
  }
  
  /**
   * Build the initial DOM structure
   */
  function buildInitialStructure() {
    const state = store.getState();
    
    rootElement.innerHTML = `
      <div class="tl-configurator">
        <!-- Language Toggle -->
        <div class="tl-lang-toggle" data-lang-toggle>
          <button class="tl-lang-btn ${state.lang === 'de' ? 'is-active' : ''}" 
                  data-action="set-lang" data-lang="de">DE</button>
          <button class="tl-lang-btn ${state.lang === 'en' ? 'is-active' : ''}" 
                  data-action="set-lang" data-lang="en">EN</button>
        </div>
        
        <!-- Header -->
        <header class="tl-header">
          <h1 class="tl-title" data-i18n="title">${t('title', state.lang)}</h1>
          <p class="tl-subtitle" data-i18n="subtitle">${t('subtitle', state.lang)}</p>
        </header>
        
        <!-- Services Grid -->
        <section class="tl-section tl-services-section">
          <h2 class="tl-section-title" data-i18n="services.title">${t('services.title', state.lang)}</h2>
          <div class="tl-services-grid" data-services-grid></div>
        </section>
        
        <!-- Build Area -->
        <section class="tl-section tl-build-section">
          <div class="tl-build-area" data-build-area></div>
        </section>
        
        <!-- Summary -->
        <aside class="tl-summary-panel" data-summary>
          <h3 class="tl-summary-title" data-i18n="summary.title">${t('summary.title', state.lang)}</h3>
          <div class="tl-summary-items" data-summary-items>
            <p class="tl-summary-empty" data-i18n="summary.empty">${t('summary.empty', state.lang)}</p>
          </div>
        </aside>
        
        <!-- Suggestion Container -->
        <div class="tl-suggestion-container" data-suggestion-container></div>
        
        <!-- Submit Section -->
        <section class="tl-submit-section" data-submit-section>
          <div class="tl-validation-errors" data-validation-errors></div>
          <button class="tl-submit-btn" data-submit-btn data-action="submit">
            <span data-i18n="submit">${t('submit', state.lang)}</span>
          </button>
          <div class="tl-submit-status" data-submit-status></div>
        </section>
      </div>
    `;
  }
  
  /**
   * Cache element references for faster access
   */
  function cacheElements() {
    elements = {
      servicesGrid: rootElement.querySelector('[data-services-grid]'),
      buildArea: rootElement.querySelector('[data-build-area]'),
      summary: rootElement.querySelector('[data-summary]'),
      summaryItems: rootElement.querySelector('[data-summary-items]'),
      submitBtn: rootElement.querySelector('[data-submit-btn]'),
      submitStatus: rootElement.querySelector('[data-submit-status]'),
      validationErrors: rootElement.querySelector('[data-validation-errors]'),
      suggestionContainer: rootElement.querySelector('[data-suggestion-container]'),
      langToggle: rootElement.querySelector('[data-lang-toggle]')
    };
  }
  
  /**
   * Main render function - called on state changes
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state (null on initial render)
   * @param {Object} action - The action that caused the change
   */
  function render(newState, prevState, action = {}) {
    // Determine what changed and render accordingly
    if (!prevState) {
      // Initial render
      renderServicesGrid(newState);
      renderSummary(newState);
      return;
    }
    
    // Language changed - re-render everything
    if (newState.lang !== prevState.lang) {
      updateAllTranslations(rootElement, newState.lang);
      renderServicesGrid(newState);
      renderAllBuilds(newState);
      renderSummary(newState);
      updateLangToggle(newState.lang);
      return;
    }
    
    // Selections changed
    if (newState.selections !== prevState.selections) {
      updateServicesGrid(newState, prevState);
      updateBuilds(newState, prevState, action);
      renderSummary(newState);
    }
    
    // Submission state changed
    if (newState.isSubmitting !== prevState.isSubmitting || 
        newState.submitStatus !== prevState.submitStatus) {
      updateSubmitUI(newState);
    }
    
    // Validation errors changed
    if (newState.validationErrors !== prevState.validationErrors) {
      renderValidationErrors(newState);
    }
    
    // Suggestion visibility changed
    if (newState.suggestionVisible !== prevState.suggestionVisible ||
        newState.currentSuggestion !== prevState.currentSuggestion) {
      updateSuggestion(newState);
    }
  }
  
  /**
   * Render the services grid
   * @param {Object} state - Current state
   */
  function renderServicesGrid(state) {
    const fragment = document.createDocumentFragment();
    
    for (const service of configData.services) {
      const isSelected = selectors.isServiceSelected(state, service.slug);
      const card = createServiceCard(service, state.lang, isSelected);
      if (card) fragment.appendChild(card);
    }
    
    elements.servicesGrid.innerHTML = '';
    elements.servicesGrid.appendChild(fragment);
    
    // Animate cards
    const cards = elements.servicesGrid.querySelectorAll('.tl-service-card');
    animateStaggered([...cards], 'fade', 30);
  }
  
  /**
   * Update services grid selection states
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   */
  function updateServicesGrid(newState, prevState) {
    const cards = elements.servicesGrid.querySelectorAll('[data-service]');
    
    cards.forEach(card => {
      const slug = card.getAttribute('data-service');
      const wasSelected = selectors.isServiceSelected(prevState, slug);
      const isSelected = selectors.isServiceSelected(newState, slug);
      
      if (wasSelected !== isSelected) {
        card.classList.toggle('is-selected', isSelected);
      }
    });
  }
  
  /**
   * Render all build areas from scratch
   * @param {Object} state - Current state
   */
  function renderAllBuilds(state) {
    elements.buildArea.innerHTML = '';
    
    const selectedServices = selectors.getSelectedServices(state);
    
    for (const serviceSlug of selectedServices) {
      const service = configData.services.find(s => s.slug === serviceSlug);
      if (service) {
        const buildEl = createServiceBuildElement(service, state);
        elements.buildArea.appendChild(buildEl);
      }
    }
  }
  
  /**
   * Update build areas based on changes
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   * @param {Object} action - The action that triggered this update
   */
  function updateBuilds(newState, prevState, action) {
    const prevServices = new Set(selectors.getSelectedServices(prevState));
    const newServices = new Set(selectors.getSelectedServices(newState));
    
    // Find added and removed services
    const added = [...newServices].filter(s => !prevServices.has(s));
    const removed = [...prevServices].filter(s => !newServices.has(s));
    
    // Remove builds for deselected services
    for (const serviceSlug of removed) {
      const buildEl = elements.buildArea.querySelector(`[data-service-build="${serviceSlug}"]`);
      if (buildEl) {
        animateCollapse(buildEl, true);
      }
    }
    
    // Add builds for newly selected services
    for (const serviceSlug of added) {
      const service = configData.services.find(s => s.slug === serviceSlug);
      if (service) {
        const buildEl = createServiceBuildElement(service, newState);
        elements.buildArea.appendChild(buildEl);
        animateExpand(buildEl);
      }
    }
    
    // Update existing builds for size/addon changes
    for (const serviceSlug of newServices) {
      if (prevServices.has(serviceSlug)) {
        const prevSelection = prevState.selections[serviceSlug];
        const newSelection = newState.selections[serviceSlug];
        
        if (prevSelection.size !== newSelection.size) {
          updateBuildSize(serviceSlug, newState, prevState);
        }
        
        if (prevSelection.addons !== newSelection.addons) {
          updateBuildAddons(serviceSlug, newState, prevState);
        }
      }
    }
  }
  
  /**
   * Create a complete service build element
   * @param {Object} service - Service data
   * @param {Object} state - Current state
   * @returns {Element} Build element
   */
  function createServiceBuildElement(service, state) {
    const selection = state.selections[service.slug];
    const buildEl = createServiceBuild(service, state.lang);
    
    // Add size selector
    const sizeSelector = buildEl.querySelector('[data-size-selector]');
    const sizes = configData.sizes[service.slug] || [];
    
    for (const size of sizes) {
      const isSelected = selection && selection.size === size.slug;
      const btn = createSizeButton(size, service.slug, state.lang, isSelected);
      if (btn) sizeSelector.appendChild(btn);
    }
    
    // Add visual container content if size is selected
    const visualContainer = buildEl.querySelector('[data-visual-container]');
    if (selection && selection.size) {
      const size = sizes.find(s => s.slug === selection.size);
      if (size) {
        renderVisuals(visualContainer, service, size, selection, state.lang);
      }
    }
    
    // Add addon buttons if size is selected
    const addonsContainer = buildEl.querySelector('[data-addons-container]');
    if (selection && selection.size) {
      renderAddonButtons(addonsContainer, service.slug, selection, state);
    }
    
    return buildEl;
  }
  
  /**
   * Update build area when size changes
   * @param {string} serviceSlug - Service slug
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   */
  function updateBuildSize(serviceSlug, newState, prevState) {
    const buildEl = elements.buildArea.querySelector(`[data-service-build="${serviceSlug}"]`);
    if (!buildEl) return;
    
    const selection = newState.selections[serviceSlug];
    const service = configData.services.find(s => s.slug === serviceSlug);
    const sizes = configData.sizes[serviceSlug] || [];
    
    // Update size button states
    const sizeButtons = buildEl.querySelectorAll('[data-size]');
    sizeButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-size') === selection.size;
      btn.classList.toggle('is-selected', isSelected);
    });
    
    // Update visuals
    const visualContainer = buildEl.querySelector('[data-visual-container]');
    visualContainer.innerHTML = '';
    
    if (selection.size) {
      const size = sizes.find(s => s.slug === selection.size);
      if (size) {
        renderVisuals(visualContainer, service, size, selection, newState.lang);
      }
    }
    
    // Update addon buttons
    const addonsContainer = buildEl.querySelector('[data-addons-container]');
    addonsContainer.innerHTML = '';
    
    if (selection.size) {
      renderAddonButtons(addonsContainer, serviceSlug, selection, newState);
    }
  }
  
  /**
   * Update build area when addons change
   * @param {string} serviceSlug - Service slug
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   */
  function updateBuildAddons(serviceSlug, newState, prevState) {
    const buildEl = elements.buildArea.querySelector(`[data-service-build="${serviceSlug}"]`);
    if (!buildEl) return;
    
    const selection = newState.selections[serviceSlug];
    const prevSelection = prevState.selections[serviceSlug];
    const addons = configData.addons[serviceSlug] || [];
    
    // Update addon button states
    const addonButtons = buildEl.querySelectorAll('[data-addon]');
    addonButtons.forEach(btn => {
      const addonSlug = btn.getAttribute('data-addon');
      const isSelected = selection.addons.has(addonSlug);
      const addon = addons.find(a => a.slug === addonSlug);
      const isDisabled = addon && addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
      
      btn.classList.toggle('is-selected', isSelected);
      btn.classList.toggle('is-disabled', isDisabled);
      btn.disabled = isDisabled;
    });
    
    // Update addon visuals
    const visualContainer = buildEl.querySelector('[data-visual-container]');
    
    // Find added and removed addons
    const prevAddons = prevSelection ? prevSelection.addons : new Set();
    const added = [...selection.addons].filter(a => !prevAddons.has(a));
    const removed = [...prevAddons].filter(a => !selection.addons.has(a));
    
    // Remove visual elements for removed addons
    for (const addonSlug of removed) {
      const visual = visualContainer.querySelector(`[data-addon-visual="${addonSlug}"], [data-addon-section="${addonSlug}"], [data-addon-badge="${addonSlug}"]`);
      if (visual) {
        animateExit(visual, 'pop', true);
      }
    }
    
    // Add visual elements for added addons
    for (const addonSlug of added) {
      const addon = addons.find(a => a.slug === addonSlug);
      if (addon) {
        const visual = createAddonVisual(addon, newState.lang);
        if (visual) {
          visualContainer.appendChild(visual);
          animateEnter(visual, 'pop');
        }
      }
    }
  }
  
  /**
   * Render visual elements in container
   * @param {Element} container - Visual container
   * @param {Object} service - Service data
   * @param {Object} size - Selected size
   * @param {Object} selection - Current selection
   * @param {string} lang - Current language
   */
  function renderVisuals(container, service, size, selection, lang) {
    let visualElements;
    
    switch (service.visualType) {
      case 'pages':
        visualElements = createPageCards(size.visualCount, lang);
        break;
      case 'modules':
      case 'cards':
      default:
        visualElements = createModuleCards(size.visualCount, lang);
        break;
    }
    
    container.appendChild(visualElements);
    
    // Add addon visuals
    const addons = configData.addons[service.slug] || [];
    for (const addonSlug of selection.addons) {
      const addon = addons.find(a => a.slug === addonSlug);
      if (addon) {
        const visual = createAddonVisual(addon, lang);
        if (visual) container.appendChild(visual);
      }
    }
    
    // Animate all visuals
    const allVisuals = container.children;
    animateStaggered([...allVisuals], 'pop', 50);
  }
  
  /**
   * Render addon buttons
   * @param {Element} container - Addons container
   * @param {string} serviceSlug - Service slug
   * @param {Object} selection - Current selection
   * @param {Object} state - Current state
   */
  function renderAddonButtons(container, serviceSlug, selection, state) {
    const addons = configData.addons[serviceSlug] || [];
    
    if (addons.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    container.style.display = '';
    
    // Add header
    const header = document.createElement('h4');
    header.className = 'tl-addons-title';
    header.setAttribute('data-i18n', 'addons.title');
    header.textContent = t('addons.title', state.lang);
    container.appendChild(header);
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'tl-addons-buttons';
    
    for (const addon of addons) {
      const isSelected = selection.addons.has(addon.slug);
      const isDisabled = addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
      const btn = createAddonButton(addon, serviceSlug, state.lang, isSelected, isDisabled);
      if (btn) buttonsContainer.appendChild(btn);
    }
    
    container.appendChild(buttonsContainer);
  }
  
  /**
   * Render the summary panel
   * @param {Object} state - Current state
   */
  function renderSummary(state) {
    const items = selectors.getSelectionSummary(state, configData);
    
    if (items.length === 0) {
      elements.summaryItems.innerHTML = `
        <p class="tl-summary-empty" data-i18n="summary.empty">${t('summary.empty', state.lang)}</p>
      `;
      return;
    }
    
    const fragment = document.createDocumentFragment();
    
    for (const item of items) {
      const chip = createSummaryChip(item);
      if (chip) fragment.appendChild(chip);
    }
    
    elements.summaryItems.innerHTML = '';
    elements.summaryItems.appendChild(fragment);
  }
  
  /**
   * Update submit button and status UI
   * @param {Object} state - Current state
   */
  function updateSubmitUI(state) {
    const btn = elements.submitBtn;
    const status = elements.submitStatus;
    
    // Update button state
    btn.disabled = state.isSubmitting;
    btn.classList.toggle('is-loading', state.isSubmitting);
    
    const btnText = btn.querySelector('[data-i18n]');
    if (btnText) {
      btnText.textContent = state.isSubmitting 
        ? t('submitting', state.lang) 
        : t('submit', state.lang);
    }
    
    // Update status message
    switch (state.submitStatus) {
      case 'success':
        status.innerHTML = `
          <div class="tl-status-success">
            <h4>${t('success.title', state.lang)}</h4>
            <p>${t('success.message', state.lang)}</p>
          </div>
        `;
        status.style.display = 'block';
        animateEnter(status, 'fade');
        break;
        
      case 'error':
        status.innerHTML = `
          <div class="tl-status-error">
            <h4>${t('error.title', state.lang)}</h4>
            <p>${t('error.message', state.lang)}</p>
            <button class="tl-retry-btn" data-action="retry">${t('error.retry', state.lang)}</button>
          </div>
        `;
        status.style.display = 'block';
        animateEnter(status, 'fade');
        break;
        
      default:
        status.style.display = 'none';
        status.innerHTML = '';
    }
  }
  
  /**
   * Render validation errors
   * @param {Object} state - Current state
   */
  function renderValidationErrors(state) {
    const container = elements.validationErrors;
    
    if (state.validationErrors.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    
    container.innerHTML = state.validationErrors
      .map(err => `<p class="tl-validation-error">${err.message}</p>`)
      .join('');
    container.style.display = 'block';
    
    animateShake(container);
    
    // Highlight affected service builds
    for (const error of state.validationErrors) {
      if (error.serviceSlug) {
        const buildEl = elements.buildArea.querySelector(`[data-service-build="${error.serviceSlug}"]`);
        if (buildEl) {
          buildEl.classList.add('has-error');
          animateShake(buildEl);
        }
      }
    }
  }
  
  /**
   * Update suggestion toast
   * @param {Object} state - Current state
   */
  function updateSuggestion(state) {
    const container = elements.suggestionContainer;
    
    if (!state.suggestionVisible || !state.currentSuggestion) {
      const existing = container.querySelector('.tl-suggestion-toast');
      if (existing) {
        animateExit(existing, 'slide', true);
      }
      return;
    }
    
    // Remove existing suggestion
    container.innerHTML = '';
    
    // Create new suggestion
    const toast = createSuggestionToast(state.currentSuggestion);
    if (toast) {
      container.appendChild(toast);
      animateEnter(toast, 'slide');
    }
  }
  
  /**
   * Update language toggle buttons
   * @param {string} lang - Current language
   */
  function updateLangToggle(lang) {
    const buttons = elements.langToggle.querySelectorAll('[data-lang]');
    buttons.forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
  }
  
  /**
   * Get the root element
   * @returns {Element} Root element
   */
  function getRoot() {
    return rootElement;
  }
  
  /**
   * Get cached elements
   * @returns {Object} Cached elements
   */
  function getElements() {
    return elements;
  }
  
  return {
    init,
    render,
    getRoot,
    getElements
  };
}

export default { createRenderer };
