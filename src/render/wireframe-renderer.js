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
      <div class="tl-configurator tl-wireframe-mode tl-tab-mode">
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
        
        <!-- Tab Navigation -->
        <nav class="tl-tab-nav" data-tab-nav>
          ${renderServiceTabs(state)}
        </nav>
        
        <!-- Tab Content Container -->
        <section class="tl-tab-content" data-tab-content>
          ${renderTabContent(state)}
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
   * Render service tabs navigation
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderServiceTabs(state) {
    const activeService = state.expandedService || configData.services[0]?.slug;
    
    return configData.services.map(service => {
      const isActive = activeService === service.slug;
      const isSelected = selectors.isServiceSelected(state, service.slug);
      const name = getLocalizedName(service, state.lang);
      
      return `
        <button class="tl-tab ${isActive ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}" 
                data-action="select-tab" 
                data-service="${service.slug}">
          <span class="tl-tab-icon">${service.icon}</span>
          <span class="tl-tab-name">${name}</span>
          ${isSelected ? '<span class="tl-tab-check">✓</span>' : ''}
        </button>
      `;
    }).join('');
  }
  
  /**
   * Render the content for the active tab
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderTabContent(state) {
    const activeServiceSlug = state.expandedService || configData.services[0]?.slug;
    const service = configData.services.find(s => s.slug === activeServiceSlug);
    
    if (!service) return '';
    
    const isSelected = selectors.isServiceSelected(state, service.slug);
    const selection = state.selections[service.slug];
    const name = getLocalizedName(service, state.lang);
    const desc = state.lang === 'en' ? service.descriptionEn : service.description;
    
    return `
      <div class="tl-tab-panel" data-tab-panel="${service.slug}">
        <!-- Service Header -->
        <div class="tl-service-header">
          <div class="tl-service-header-info">
            <span class="tl-service-icon-large">${service.icon}</span>
            <div>
              <h2 class="tl-service-title">${name}</h2>
              <p class="tl-service-description">${desc}</p>
            </div>
          </div>
          ${!isSelected ? `
            <button class="tl-add-service-btn" data-action="toggle-service" data-service="${service.slug}">
              <span>+</span> ${state.lang === 'de' ? 'Hinzufügen' : 'Add'}
            </button>
          ` : `
            <button class="tl-remove-service-btn" data-action="remove" data-target="service:${service.slug}">
              <span>×</span> ${state.lang === 'de' ? 'Entfernen' : 'Remove'}
            </button>
          `}
        </div>
        
        <!-- Service Configuration (only if selected) -->
        ${isSelected ? renderServiceConfiguration(service, selection, state) : `
          <div class="tl-service-placeholder">
            <p>${state.lang === 'de' 
              ? 'Klicke auf "Hinzufügen" um diesen Service zu konfigurieren' 
              : 'Click "Add" to configure this service'}</p>
          </div>
        `}
      </div>
    `;
  }
  
  /**
   * Render service configuration (size, addons, visual)
   * @param {Object} service - Service data
   * @param {Object} selection - Current selection
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderServiceConfiguration(service, selection, state) {
    const sizes = configData.sizes[service.slug] || [];
    const addons = configData.addons[service.slug] || [];
    
    // Check if there are available (non-selected) addons
    const availableAddons = addons.filter(addon => !selection.addons.has(addon.slug));
    
    return `
      <div class="tl-service-config">
        <!-- Visual Stack Area -->
        <div class="tl-visual-stack-area" data-visual-area="${service.slug}">
          ${renderVisualStack(service, selection, state, false)}
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
          
          <!-- Addons Section (only show if size selected AND addons available) -->
          ${selection && selection.size && availableAddons.length > 0 ? `
            <div class="tl-options-section">
              <h4 class="tl-options-title" data-i18n="addons.title">${t('addons.title', state.lang)}</h4>
              <div class="tl-addon-options" data-addon-options="${service.slug}">
                ${availableAddons.map(addon => {
                  const isDisabled = addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
                  const addonName = getLocalizedName(addon, state.lang);
                  
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
   * @param {boolean} animatePages - Whether to animate the pages (only on size change)
   * @returns {string} HTML string
   */
  function renderVisualStack(service, selection, state, animatePages = false) {
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
        return renderPageStack(count, selection, addons, state, animatePages, service.slug);
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
        return renderPageStack(count, selection, addons, state, animatePages, service.slug);
      default:
        return renderPageStack(count, selection, addons, state, animatePages, service.slug);
    }
  }
  
  /**
   * Render stacked page wireframes (for Webdesign)
   * @param {number} count - Number of pages
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @param {boolean} animate - Whether to animate the pages
   * @param {string} serviceSlug - The service slug
   * @returns {string} HTML string
   */
  function renderPageStack(count, selection, addons, state, animate = false, serviceSlug = 'webdesign') {
    const pageCount = Math.min(count, 10);
    const pages = [];
    const hasBlog = selection && selection.addons && selection.addons.has('blog');
    
    for (let i = 1; i <= pageCount; i++) {
      const animClass = animate ? 'animate-in' : '';
      const animStyle = animate ? `animation-delay: ${(i-1) * 80}ms;` : '';
      pages.push(`
        <div class="tl-stacked-item ${animClass}" style="${animStyle}">
          ${createPageWireframeSVG(i, pageCount, hasBlog)}
        </div>
      `);
    }
    
    // Get positioned addons (overlays and bottom)
    const { overlayAddons, bottomAddons } = renderAddonOverlays(selection, addons, state, serviceSlug);
    
    return `
      <div class="tl-visual-main">
        <div class="tl-stack-container">
          ${pages.join('')}
        </div>
        <div class="tl-addon-overlays">
          ${overlayAddons.join('')}
        </div>
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
   * @param {string} serviceSlug - The service slug (for remove action)
   * @returns {Object} { overlayAddons: [], bottomAddons: [] }
   */
  function renderAddonOverlays(selection, addons, state, serviceSlug = 'webdesign') {
    const overlayAddons = [];
    const bottomAddons = [];
    
    if (!selection || !selection.addons) {
      return { overlayAddons, bottomAddons };
    }
    
    // Define which addons go where
    // Blog is now integrated into SVG, so skip it
    // Analytics goes to bottom
    // Others are overlays on/around the stack
    const bottomAddonSlugs = ['analytics'];
    const skipAddons = ['blog']; // Integrated into wireframe SVG
    
    for (const addonSlug of selection.addons) {
      // Skip addons that are integrated into the SVG
      if (skipAddons.includes(addonSlug)) continue;
      
      const addon = addons.find(a => a.slug === addonSlug);
      if (!addon) continue;
      
      const generator = getAddonSVGGenerator(addonSlug);
      if (generator) {
        const removeTitle = state.lang === 'de' ? 'Entfernen' : 'Remove';
        
        if (bottomAddonSlugs.includes(addonSlug)) {
          // Bottom addons (analytics) - wrapped in visual wrapper with specific class
          const html = `
            <div class="tl-addon-visual-wrapper tl-addon-overlay tl-addon-${addonSlug} animate-in" style="animation-delay: 200ms;">
              ${generator()}
              <button class="tl-addon-remove" 
                      data-action="remove" 
                      data-target="addon:${serviceSlug}:${addonSlug}"
                      title="${removeTitle}">×</button>
            </div>
          `;
          bottomAddons.push(html);
        } else {
          // Overlay addons - wrapper has both positioning and hover functionality
          const html = `
            <div class="tl-addon-visual-wrapper tl-addon-overlay tl-addon-${addonSlug} animate-in" style="animation-delay: 200ms;">
              ${generator()}
              <button class="tl-addon-remove" 
                      data-action="remove" 
                      data-target="addon:${serviceSlug}:${addonSlug}"
                      title="${removeTitle}">×</button>
            </div>
          `;
          overlayAddons.push(html);
        }
      }
    }
    
    return { overlayAddons, bottomAddons };
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
      tabNav: rootElement.querySelector('[data-tab-nav]'),
      tabContent: rootElement.querySelector('[data-tab-content]'),
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
    
    // Selections or expanded service changed
    if (newState.selections !== prevState.selections || 
        newState.expandedService !== prevState.expandedService) {
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
   * Update tabs and content based on state changes
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   */
  function updateServiceItems(newState, prevState) {
    // Update tab navigation
    elements.tabNav.innerHTML = renderServiceTabs(newState);
    
    // Update tab content
    elements.tabContent.innerHTML = renderTabContent(newState);
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
