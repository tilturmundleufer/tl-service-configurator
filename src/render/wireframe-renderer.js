/**
 * Wireframe Renderer - Handles the new nested wireframe-based UI
 */

import { CONFIG } from '../config.js';
import { t, getLocalizedName, updateAllTranslations } from '../utils/i18n.js';
import * as selectors from '../state/selectors.js';
import { canAddAddon } from '../state/reducer.js';
import {
  createPageWireframeSVG,
  createBlogAddonSVG,
  createMultilingualAddonSVG,
  createCMSAddonSVG,
  createSEOAddonSVG,
  createAnalyticsAddonSVG,
  createSocialPostSVG,
  createJobCardSVG,
  createWebappSVG,
  createAutomationFlowSVG,
  getAddonSVGGenerator
} from './wireframes.js';
import { injectAnimationStyles } from './animations.js';

/**
 * Create the wireframe renderer
 * @param {Element} rootElement - Root container element
 * @param {Object} store - State store
 * @param {Object} configData - CMS configuration data
 * @returns {Object} Renderer API
 */
export function createWireframeRenderer(rootElement, store, configData) {
  let elements = {};
  
  /**
   * Initialize the renderer
   */
  function init() {
    injectAnimationStyles();
    buildInitialStructure();
    cacheElements();
    render(store.getState(), null);
  }
  
  /**
   * Build initial DOM structure
   */
  function buildInitialStructure() {
    const state = store.getState();
    
    rootElement.innerHTML = `
      <div class="tl-configurator tl-wireframe-mode">
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
        
        <!-- Services Container -->
        <section class="tl-services-container" data-services-container>
          ${renderServiceItems(state)}
        </section>
        
        <!-- Summary Panel -->
        <aside class="tl-summary-panel" data-summary>
          <h3 class="tl-summary-title" data-i18n="summary.title">${t('summary.title', state.lang)}</h3>
          <div class="tl-summary-content" data-summary-content>
            ${renderSummaryContent(state)}
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
   * Render all service items (buttons + wireframe containers)
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderServiceItems(state) {
    return configData.services.map(service => {
      const isSelected = selectors.isServiceSelected(state, service.slug);
      const selection = state.selections[service.slug];
      const name = getLocalizedName(service, state.lang);
      const desc = state.lang === 'en' ? service.descriptionEn : service.description;
      
      return `
        <div class="tl-service-item" data-service-item="${service.slug}">
          <!-- Collapsed Service Button -->
          <button class="tl-service-button ${isSelected ? 'is-expanded' : ''}" 
                  data-action="toggle-service" 
                  data-service="${service.slug}">
            <span class="tl-service-icon-large">${service.icon}</span>
            <div class="tl-service-info">
              <h3 class="tl-service-name-large">${name}</h3>
              <p class="tl-service-desc">${desc}</p>
            </div>
            <span class="tl-service-arrow">→</span>
          </button>
          
          <!-- Expanded Wireframe Container -->
          <div class="tl-wireframe-container ${isSelected ? 'is-active' : ''}" 
               data-wireframe="${service.slug}">
            ${renderWireframeContent(service, selection, state)}
          </div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Render wireframe content for a service
   * @param {Object} service - Service data
   * @param {Object} selection - Current selection
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderWireframeContent(service, selection, state) {
    const name = getLocalizedName(service, state.lang);
    const sizes = configData.sizes[service.slug] || [];
    const addons = configData.addons[service.slug] || [];
    
    return `
      <!-- Header -->
      <div class="tl-wireframe-header">
        <h3 class="tl-wireframe-title">
          <span>${service.icon}</span>
          ${name}
        </h3>
        <button class="tl-wireframe-close" data-action="remove" data-target="service:${service.slug}">×</button>
      </div>
      
      <!-- Content -->
      <div class="tl-wireframe-content">
        <!-- Visual Stack Area -->
        <div class="tl-visual-stack-area" data-visual-area="${service.slug}">
          ${renderVisualStack(service, selection, state)}
        </div>
        
        <!-- Options Panel -->
        <div class="tl-options-panel">
          <!-- Size Selection -->
          <div class="tl-options-section">
            <h4 class="tl-options-title" data-i18n="size.title">${t('size.title', state.lang)}</h4>
            <div class="tl-size-options" data-size-options="${service.slug}">
              ${sizes.map(size => {
                const isSelected = selection && selection.size === size.slug;
                const sizeName = getLocalizedName(size, state.lang);
                return `
                  <button class="tl-size-option ${isSelected ? 'is-selected' : ''}"
                          data-action="set-size"
                          data-size="${size.slug}"
                          data-for-service="${service.slug}">
                    <span>${sizeName}</span>
                    <span class="tl-size-check">✓</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Addons Section (only show if size selected) -->
          ${selection && selection.size ? `
            <div class="tl-options-section">
              <h4 class="tl-options-title" data-i18n="addons.title">${t('addons.title', state.lang)}</h4>
              <div class="tl-addon-options" data-addon-options="${service.slug}">
                ${addons.map(addon => {
                  const isSelected = selection.addons.has(addon.slug);
                  const isDisabled = addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
                  const addonName = getLocalizedName(addon, state.lang);
                  
                  // Hide selected addons (they appear in wireframe)
                  if (isSelected) return '';
                  
                  return `
                    <button class="tl-addon-option ${isDisabled ? 'is-disabled' : ''}"
                            data-action="toggle-addon"
                            data-addon="${addon.slug}"
                            data-for-service="${service.slug}"
                            ${isDisabled ? 'disabled' : ''}>
                      <span class="tl-addon-option-icon">${addon.icon}</span>
                      <span>${addonName}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  /**
   * Render the visual stack based on service type
   * @param {Object} service - Service data
   * @param {Object} selection - Current selection
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderVisualStack(service, selection, state) {
    if (!selection || !selection.size) {
      // Show placeholder when no size selected
      return `
        <div class="tl-visual-placeholder">
          <p style="color: var(--tl-color-gray-400); text-align: center;">
            ${state.lang === 'de' ? 'Wähle eine Größe um die Vorschau zu sehen' : 'Select a size to see preview'}
          </p>
        </div>
      `;
    }
    
    const sizes = configData.sizes[service.slug] || [];
    const size = sizes.find(s => s.slug === selection.size);
    const count = size ? size.visualCount : 1;
    const addons = configData.addons[service.slug] || [];
    
    switch (service.visualType) {
      case 'pages':
        return renderPageStack(count, selection, addons, state);
      case 'modules':
        if (service.slug === 'automation') {
          return renderAutomationFlow(count, selection, addons, state);
        }
        return renderWebappVisual(count, selection, addons, state);
      case 'cards':
        if (service.slug === 'recruiting') {
          return renderJobCards(count, selection, addons, state);
        }
        if (service.slug === 'social_media') {
          return renderSocialPosts(count, selection, addons, state);
        }
        return renderPageStack(count, selection, addons, state);
      default:
        return renderPageStack(count, selection, addons, state);
    }
  }
  
  /**
   * Render stacked page wireframes (for Webdesign)
   * @param {number} count - Number of pages
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderPageStack(count, selection, addons, state) {
    const pageCount = Math.min(count, 10);
    const pages = [];
    
    for (let i = 1; i <= pageCount; i++) {
      pages.push(`
        <div class="tl-stacked-item animate-in" style="animation-delay: ${(i-1) * 80}ms;">
          ${createPageWireframeSVG(i)}
        </div>
      `);
    }
    
    // Separate side addons from bottom addons
    const { sideAddons, bottomAddons } = renderAddonOverlays(selection, addons, state);
    
    return `
      <div class="tl-visual-main">
        <div class="tl-stack-container">
          ${pages.join('')}
        </div>
        ${sideAddons.length > 0 ? `
          <div class="tl-addon-overlays">
            ${sideAddons.join('')}
          </div>
        ` : ''}
      </div>
      ${bottomAddons.length > 0 ? `
        <div class="tl-addon-bottom">
          ${bottomAddons.join('')}
        </div>
      ` : ''}
    `;
  }
  
  /**
   * Render addon overlay visualizations
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @returns {Object} { sideAddons: [], bottomAddons: [] }
   */
  function renderAddonOverlays(selection, addons, state) {
    const sideAddons = [];
    const bottomAddons = [];
    
    if (!selection || !selection.addons) {
      return { sideAddons, bottomAddons };
    }
    
    // Define which addons go where
    const bottomAddonSlugs = ['blog', 'analytics'];
    
    for (const addonSlug of selection.addons) {
      const addon = addons.find(a => a.slug === addonSlug);
      if (!addon) continue;
      
      const generator = getAddonSVGGenerator(addonSlug);
      if (generator) {
        const html = `
          <div class="animate-in" style="animation-delay: 200ms;">
            ${generator()}
          </div>
        `;
        
        if (bottomAddonSlugs.includes(addonSlug)) {
          bottomAddons.push(html);
        } else {
          sideAddons.push(html);
        }
      }
    }
    
    return { sideAddons, bottomAddons };
  }
  
  /**
   * Render social media posts
   * @param {number} count - Number of posts
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderSocialPosts(count, selection, addons, state) {
    const postCount = Math.min(count, 6);
    const posts = [];
    
    for (let i = 1; i <= postCount; i++) {
      posts.push(`
        <div class="tl-social-post animate-in" style="animation-delay: ${(i-1) * 100}ms;">
          ${createSocialPostSVG(i)}
        </div>
      `);
    }
    
    return `
      <div class="tl-social-stack">
        ${posts.join('')}
      </div>
    `;
  }
  
  /**
   * Render recruiting job cards
   * @param {number} count - Number of jobs
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderJobCards(count, selection, addons, state) {
    const jobCount = Math.min(count, 6);
    const jobs = [];
    
    for (let i = 1; i <= jobCount; i++) {
      jobs.push(`
        <div class="tl-job-card animate-in" style="animation-delay: ${(i-1) * 100}ms;">
          ${createJobCardSVG(i)}
        </div>
      `);
    }
    
    return `
      <div class="tl-job-stack">
        ${jobs.join('')}
      </div>
    `;
  }
  
  /**
   * Render webapp interface
   * @param {number} moduleCount - Number of modules
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderWebappVisual(moduleCount, selection, addons, state) {
    return `
      <div class="tl-webapp-visual animate-in">
        ${createWebappSVG(moduleCount)}
      </div>
    `;
  }
  
  /**
   * Render automation flow
   * @param {number} nodeCount - Number of nodes
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderAutomationFlow(nodeCount, selection, addons, state) {
    return `
      <div class="tl-automation-visual animate-in">
        ${createAutomationFlowSVG(nodeCount)}
      </div>
    `;
  }
  
  /**
   * Render hierarchical summary content
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderSummaryContent(state) {
    const selectedServices = selectors.getSelectedServices(state);
    
    if (selectedServices.length === 0) {
      return `<p class="tl-summary-empty" data-i18n="summary.empty">${t('summary.empty', state.lang)}</p>`;
    }
    
    return selectedServices.map(serviceSlug => {
      const selection = state.selections[serviceSlug];
      const service = configData.services.find(s => s.slug === serviceSlug);
      if (!service) return '';
      
      const serviceName = getLocalizedName(service, state.lang);
      const sizes = configData.sizes[serviceSlug] || [];
      const size = selection.size ? sizes.find(s => s.slug === selection.size) : null;
      const sizeName = size ? getLocalizedName(size, state.lang) : null;
      const addonConfig = configData.addons[serviceSlug] || [];
      
      return `
        <div class="tl-summary-service" data-summary-service="${serviceSlug}">
          <div class="tl-summary-service-header">
            <div class="tl-summary-service-name">
              <span>${service.icon}</span>
              ${serviceName}
            </div>
            <button class="tl-summary-remove" data-action="remove" data-target="service:${serviceSlug}">×</button>
          </div>
          ${sizeName ? `<div class="tl-summary-size">📐 ${sizeName}</div>` : ''}
          ${selection.addons.size > 0 ? `
            <div class="tl-summary-addons">
              ${[...selection.addons].map(addonSlug => {
                const addon = addonConfig.find(a => a.slug === addonSlug);
                if (!addon) return '';
                const addonName = getLocalizedName(addon, state.lang);
                return `
                  <span class="tl-summary-addon">
                    ${addon.icon} ${addonName}
                    <button data-action="remove" data-target="addon:${serviceSlug}:${addonSlug}">×</button>
                  </span>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }
  
  /**
   * Cache element references
   */
  function cacheElements() {
    elements = {
      servicesContainer: rootElement.querySelector('[data-services-container]'),
      summary: rootElement.querySelector('[data-summary]'),
      summaryContent: rootElement.querySelector('[data-summary-content]'),
      submitBtn: rootElement.querySelector('[data-submit-btn]'),
      submitStatus: rootElement.querySelector('[data-submit-status]'),
      validationErrors: rootElement.querySelector('[data-validation-errors]'),
      suggestionContainer: rootElement.querySelector('[data-suggestion-container]'),
      langToggle: rootElement.querySelector('[data-lang-toggle]')
    };
  }
  
  /**
   * Main render function
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   * @param {Object} action - Action that triggered change
   */
  function render(newState, prevState, action = {}) {
    if (!prevState) {
      // Initial render already done in init
      return;
    }
    
    // Language changed - re-render everything
    if (newState.lang !== prevState.lang) {
      updateAllTranslations(rootElement, newState.lang);
      elements.servicesContainer.innerHTML = renderServiceItems(newState);
      elements.summaryContent.innerHTML = renderSummaryContent(newState);
      updateLangToggle(newState.lang);
      return;
    }
    
    // Selections changed
    if (newState.selections !== prevState.selections) {
      updateServiceItems(newState, prevState);
      elements.summaryContent.innerHTML = renderSummaryContent(newState);
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
   * Update service items based on selection changes
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   */
  function updateServiceItems(newState, prevState) {
    const allServices = configData.services.map(s => s.slug);
    
    for (const serviceSlug of allServices) {
      const wasSelected = prevState && selectors.isServiceSelected(prevState, serviceSlug);
      const isSelected = selectors.isServiceSelected(newState, serviceSlug);
      
      const serviceItem = rootElement.querySelector(`[data-service-item="${serviceSlug}"]`);
      if (!serviceItem) continue;
      
      const button = serviceItem.querySelector('.tl-service-button');
      const wireframe = serviceItem.querySelector('.tl-wireframe-container');
      
      if (wasSelected !== isSelected) {
        // Toggle visibility
        button.classList.toggle('is-expanded', isSelected);
        wireframe.classList.toggle('is-active', isSelected);
      }
      
      if (isSelected) {
        // Update wireframe content
        const service = configData.services.find(s => s.slug === serviceSlug);
        const selection = newState.selections[serviceSlug];
        wireframe.innerHTML = renderWireframeContent(service, selection, newState);
      }
    }
  }
  
  /**
   * Update submit button and status
   * @param {Object} state - Current state
   */
  function updateSubmitUI(state) {
    const btn = elements.submitBtn;
    const status = elements.submitStatus;
    
    btn.disabled = state.isSubmitting;
    btn.classList.toggle('is-loading', state.isSubmitting);
    
    const btnText = btn.querySelector('[data-i18n]');
    if (btnText) {
      btnText.textContent = state.isSubmitting 
        ? t('submitting', state.lang) 
        : t('submit', state.lang);
    }
    
    switch (state.submitStatus) {
      case 'success':
        status.innerHTML = `
          <div class="tl-status-success">
            <h4>${t('success.title', state.lang)}</h4>
            <p>${t('success.message', state.lang)}</p>
          </div>
        `;
        status.style.display = 'block';
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
  }
  
  /**
   * Update suggestion toast
   * @param {Object} state - Current state
   */
  function updateSuggestion(state) {
    const container = elements.suggestionContainer;
    
    if (!state.suggestionVisible || !state.currentSuggestion) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = `
      <div class="tl-suggestion-toast">
        <span class="tl-suggestion-icon">💡</span>
        <span class="tl-suggestion-text">${state.currentSuggestion.text}</span>
        <button class="tl-suggestion-dismiss" data-action="dismiss-suggestion">×</button>
      </div>
    `;
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
  
  return {
    init,
    render,
    getRoot: () => rootElement,
    getElements: () => elements
  };
}

export default { createWireframeRenderer };
