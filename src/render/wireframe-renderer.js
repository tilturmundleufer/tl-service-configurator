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
  getAddonSVGGenerator,
  createInitialPageImage,
  ADDON_IMAGES
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
   * Build initial DOM structure - 2-column layout (no left tabs)
   */
  function buildInitialStructure() {
    const state = store.getState();
    
    rootElement.innerHTML = `
      <div class="tl-configurator tl-wireframe-mode tl-step-mode">
        <!-- Language Toggle (top right) -->
        <div class="tl-lang-toggle" data-lang-toggle>
          <button class="tl-lang-btn ${state.lang === 'de' ? 'is-active' : ''}" 
                  data-action="set-lang" data-lang="de">DE</button>
          <button class="tl-lang-btn ${state.lang === 'en' ? 'is-active' : ''}" 
                  data-action="set-lang" data-lang="en">EN</button>
        </div>
        
        <!-- Main Layout: 2 columns - Content | Sidebar -->
        <div class="tl-main-layout-2col">
          <!-- Left/Center: Main Content Area -->
          <div class="tl-configurator-content" data-main-content>
            ${renderMainContent(state)}
          </div>
          
          <!-- Right: Options + Summary Sidebar -->
          <aside class="tl-configurator-sidebar" data-sidebar>
            <!-- Options Panel (Size + Addons) -->
            <div class="tl-options-sidebar" data-options-sidebar>
              ${renderOptionsSidebar(state)}
            </div>
            
            <!-- Optional Features (appears after step 'extras') -->
            <div class="tl-optional-features" data-optional-features>
              ${renderOptionalFeatures(state)}
            </div>
            
            <!-- Summary Panel -->
            <div class="tl-summary-panel-compact" data-summary>
              <h3 class="tl-summary-title-compact" data-i18n="summary.title">
                <span class="tl-summary-collapse-icon">▼</span>
                ${t('summary.title', state.lang)}
              </h3>
              <div class="tl-summary-content" data-summary-content>
                ${renderSummaryContent(state)}
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="tl-submit-section" data-submit-section>
              <div class="tl-validation-errors" data-validation-errors></div>
              ${renderActionButtons(state)}
              <div class="tl-submit-status" data-submit-status></div>
            </div>
          </aside>
        </div>
        
        <!-- Suggestion Container -->
        <div class="tl-suggestion-container" data-suggestion-container></div>
      </div>
    `;
  }
  
  /**
   * Render action buttons based on current step
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderActionButtons(state) {
    const webdesignSelection = state.selections['webdesign'];
    const hasSize = webdesignSelection && webdesignSelection.size;
    
    if (state.currentStep === 'add' || state.currentStep === 'configure') {
      // Show "Continue" button, disabled until size is selected
      return `
        <button class="tl-continue-btn ${!hasSize ? 'is-disabled' : ''}" 
                data-action="next-step" 
                ${!hasSize ? 'disabled' : ''}>
          <span>${state.lang === 'de' ? 'Weiter' : 'Continue'}</span>
        </button>
        <button class="tl-contact-btn" data-action="contact">
          <span>${state.lang === 'de' ? 'Kontakt' : 'Contact Us'}</span>
        </button>
      `;
    } else {
      // Show "Submit" button in extras/complete step
      return `
        <button class="tl-submit-btn" data-submit-btn data-action="submit">
          <span data-i18n="submit">${t('submit', state.lang)}</span>
        </button>
        <button class="tl-contact-btn" data-action="contact">
          <span>${state.lang === 'de' ? 'Kontakt' : 'Contact Us'}</span>
        </button>
      `;
    }
  }
  
  /**
   * Render optional features in sidebar (for extras step)
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderOptionalFeatures(state) {
    if (state.currentStep !== 'extras' && state.currentStep !== 'complete') {
      return '';
    }
    
    const extraServicesList = configData.extraServices || [];
    
    return `
      <div class="tl-options-section">
        <h4 class="tl-options-title">${state.lang === 'de' ? 'Optionale Features' : 'Optional Features'}</h4>
        <div class="tl-optional-features-list">
          ${extraServicesList.map(service => {
            const isSelected = state.extraServices.has(service.slug);
            const name = state.lang === 'en' ? service.nameEn : service.name;
            return `
              <button class="tl-optional-feature-btn ${isSelected ? 'is-selected' : ''}"
                      data-action="toggle-extra-service"
                      data-extra-service="${service.slug}">
                <span>${name}</span>
                ${isSelected ? '<span class="tl-check">✓</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Render main content based on current step
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderMainContent(state) {
    const webdesignService = configData.services.find(s => s.slug === 'webdesign');
    const isWebdesignSelected = selectors.isServiceSelected(state, 'webdesign');
    const webdesignSelection = state.selections['webdesign'];
    const name = webdesignService ? getLocalizedName(webdesignService, state.lang) : 'Web Design';
    const desc = webdesignService ? (state.lang === 'en' ? webdesignService.descriptionEn : webdesignService.description) : '';
    
    // Step 1: Add - Show large Add button
    if (!isWebdesignSelected) {
      return `
        <div class="tl-main-panel">
          <div class="tl-service-header">
            <div class="tl-service-header-info">
              <span class="tl-service-icon-large">${webdesignService?.icon || '🌐'}</span>
              <div>
                <h2 class="tl-service-title">${name}</h2>
                <p class="tl-service-description">${desc}</p>
              </div>
            </div>
          </div>
          
          <button type="button" class="tl-add-btn-large" data-action="toggle-service" data-service="webdesign">
            <span>+ ${state.lang === 'de' ? 'Hinzufügen' : 'Add'}</span>
          </button>
        </div>
      `;
    }
    
    // Step 2: Configure - Show size cards and visualization
    if (state.currentStep === 'add' || state.currentStep === 'configure') {
      return `
        <div class="tl-main-panel">
          <div class="tl-service-header">
            <div class="tl-service-header-info">
              <span class="tl-service-icon-large">${webdesignService?.icon || '🌐'}</span>
              <div>
                <h2 class="tl-service-title">${name}</h2>
                <p class="tl-service-description">${desc}</p>
              </div>
            </div>
            <button class="tl-add-service-btn" data-action="toggle-service" data-service="webdesign">
              <span>+</span> ${state.lang === 'de' ? 'Hinzufügen' : 'Add'}
            </button>
          </div>
          
          <!-- Size Selection as Cards -->
          ${renderSizeCards(state)}
          
          <!-- Visualization (if size selected) -->
          ${webdesignSelection?.size ? renderServiceVisualization(webdesignService, webdesignSelection, state) : ''}
        </div>
      `;
    }
    
    // Step 3: Extras - Show "We also offer" section
    return `
      <div class="tl-main-panel">
        <div class="tl-service-header">
          <div class="tl-service-header-info">
            <span class="tl-service-icon-large">${webdesignService?.icon || '🌐'}</span>
            <div>
              <h2 class="tl-service-title">${name}</h2>
              <p class="tl-service-description">${desc}</p>
            </div>
          </div>
        </div>
        
        <!-- We also offer section -->
        ${renderExtrasSection(state)}
      </div>
    `;
  }
  
  /**
   * Render size selection as cards
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderSizeCards(state) {
    const sizes = configData.sizes['webdesign'] || [];
    const selection = state.selections['webdesign'];
    const selectedSize = selection?.size;
    
    return `
      <div class="tl-size-cards">
        ${sizes.map(size => {
          const isSelected = selectedSize === size.slug;
          const sizeName = getLocalizedName(size, state.lang);
          const isPopular = size.slug === '5_pages';
          
          return `
            <button class="tl-size-card ${isSelected ? 'is-selected' : ''}"
                    data-action="set-size"
                    data-size="${size.slug}"
                    data-for-service="webdesign">
              ${isPopular ? `<span class="tl-badge tl-badge-popular">${state.lang === 'de' ? 'Am beliebtesten' : 'Most popular'}</span>` : ''}
              <span class="tl-size-card-label">${sizeName}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }
  
  /**
   * Render "We also offer" extras section
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderExtrasSection(state) {
    const extraServicesList = configData.extraServices || [];
    
    return `
      <section class="tl-extras-section">
        <h3 class="tl-extras-title">${state.lang === 'de' ? 'Wir bieten auch' : 'We also offer'}</h3>
        <div class="tl-extras-cards">
          ${extraServicesList.map(service => {
            const isIncluded = state.extraServices.has(service.slug);
            const name = state.lang === 'en' ? service.nameEn : service.name;
            const desc = state.lang === 'en' ? service.descriptionEn : service.description;
            const features = service.features.map(f => state.lang === 'en' ? f.en : f.de);
            
            return `
              <div class="tl-extra-card ${isIncluded ? 'is-included' : ''}">
                <div class="tl-extra-card-header">
                  <h4 class="tl-extra-card-title">
                    ${name}
                    ${service.popular ? `<span class="tl-badge tl-badge-popular">Popular</span>` : ''}
                  </h4>
                  <p class="tl-extra-card-desc">${desc}</p>
                </div>
                <button class="tl-include-btn ${isIncluded ? 'is-included' : ''}"
                        data-action="toggle-extra-service"
                        data-extra-service="${service.slug}">
                  ${isIncluded 
                    ? (state.lang === 'de' ? 'Entfernen' : 'Remove')
                    : (state.lang === 'de' ? 'Hinzufügen' : 'Include')}
                </button>
                <ul class="tl-features-list">
                  ${features.map(f => `<li><span class="tl-check-icon">✓</span> ${f}</li>`).join('')}
                </ul>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }
  
  
  /**
   * Render options sidebar (Addons for webdesign - Size is now in main content as cards)
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderOptionsSidebar(state) {
    const isWebdesignSelected = selectors.isServiceSelected(state, 'webdesign');
    const selection = state.selections['webdesign'];
    const addons = configData.addons['webdesign'] || [];
    
    // Don't show addons until webdesign is selected and has a size
    if (!isWebdesignSelected || !selection?.size) {
      return '';
    }
    
    // Check if there are available (non-selected) addons
    const availableAddons = selection ? addons.filter(addon => !selection.addons.has(addon.slug)) : addons;
    
    return `
      <!-- Addons Section -->
      <div class="tl-options-section">
        <h4 class="tl-options-title">${state.lang === 'de' ? 'Zusätzliche Optionen' : 'Additional Options'}</h4>
        <div class="tl-addon-options" data-addon-options="webdesign">
          ${availableAddons.length > 0 ? availableAddons.map(addon => {
            const isDisabled = addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
            const addonName = getLocalizedName(addon, state.lang);
            
            return `
              <button class="tl-addon-option ${isDisabled ? 'is-disabled' : ''}"
                      data-action="toggle-addon"
                      data-addon="${addon.slug}"
                      data-for-service="webdesign"
                      ${isDisabled ? 'disabled' : ''}>
                <span>${addonName}</span>
              </button>
            `;
          }).join('') : `<p class="tl-no-addons">${state.lang === 'de' ? 'Alle Add-ons ausgewählt' : 'All add-ons selected'}</p>`}
        </div>
      </div>
    `;
  }
  
  
  /**
   * Render service visualization only (options are in sidebar)
   * @param {Object} service - Service data
   * @param {Object} selection - Current selection
   * @param {Object} state - Current state
   * @returns {string} HTML string
   */
  function renderServiceVisualization(service, selection, state) {
    return `
      <div class="tl-visual-stack-area" data-visual-area="${service.slug}">
        ${renderVisualStack(service, selection, state, false)}
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
   * Render stacked page wireframes (for Webdesign) - Vertical layout
   * CMS and Blog are overlays on the base image, only Analytics is appended below
   * @param {number} count - Number of pages
   * @param {Object} selection - Current selection
   * @param {Array} addons - Addon configurations
   * @param {Object} state - Current state
   * @param {boolean} animate - Whether to animate the pages
   * @param {string} serviceSlug - The service slug
   * @returns {string} HTML string
   */
  function renderPageStack(count, selection, addons, state, animate = false, serviceSlug = 'webdesign') {
    const selectedAddons = selection && selection.addons ? selection.addons : new Set();
    const removeTitle = state.lang === 'de' ? 'Entfernen' : 'Remove';
    
    const hasMultilang = selectedAddons.has('multilang');
    const hasSeo = selectedAddons.has('seo');
    const hasCms = selectedAddons.has('cms');
    const hasBlog = selectedAddons.has('blog');
    const hasAnalytics = selectedAddons.has('analytics');
    
    // Main page with all positioned overlays (Multilingual, SEO, CMS, Blog)
    const mainPageHtml = `
      <div class="tl-visual-page-wrapper">
        <!-- Main Page Image (base) -->
        <img src="${ADDON_IMAGES.initialPage}" alt="Page Preview" class="tl-main-page-image ${animate ? 'animate-in' : ''}" loading="lazy" />
        
        <!-- Positioned overlays ON the page -->
        ${hasMultilang ? `
          <div class="tl-addon-positioned tl-addon-multilang-pos animate-in">
            <img src="${ADDON_IMAGES.multilang}" alt="Multilingual" class="tl-addon-image tl-multilingual-image" loading="lazy" />
            <button class="tl-addon-remove" data-action="remove" data-target="addon:${serviceSlug}:multilang" title="${removeTitle}">×</button>
          </div>
        ` : ''}
        ${hasSeo ? `
          <div class="tl-addon-positioned tl-addon-seo-pos animate-in">
            <img src="${ADDON_IMAGES.seo}" alt="SEO Optimisation" class="tl-addon-image tl-seo-image" loading="lazy" />
            <button class="tl-addon-remove" data-action="remove" data-target="addon:${serviceSlug}:seo" title="${removeTitle}">×</button>
          </div>
        ` : ''}
        ${hasCms ? `
          <div class="tl-addon-positioned tl-addon-cms-pos animate-in">
            <div class="tl-addon-cover-white"></div>
            <img src="${ADDON_IMAGES.cms}" alt="CMS Integration" class="tl-addon-image tl-cms-image" loading="lazy" />
            <button class="tl-addon-remove" data-action="remove" data-target="addon:${serviceSlug}:cms" title="${removeTitle}">×</button>
          </div>
        ` : ''}
        ${hasBlog ? `
          <div class="tl-addon-positioned tl-addon-blog-pos animate-in">
            <div class="tl-addon-cover-white"></div>
            <img src="${ADDON_IMAGES.blog}" alt="Blog Section" class="tl-addon-image tl-blog-image" loading="lazy" />
            <button class="tl-addon-remove" data-action="remove" data-target="addon:${serviceSlug}:blog" title="${removeTitle}">×</button>
          </div>
        ` : ''}
      </div>
    `;
    
    // Only Analytics is appended below the main page
    const analyticsHtml = hasAnalytics ? `
      <div class="tl-addon-section-vertical tl-addon-analytics-section animate-in">
        <img src="${ADDON_IMAGES.analytics}" alt="Analytical Setup" class="tl-addon-image tl-analytics-image" loading="lazy" />
        <button class="tl-addon-remove" data-action="remove" data-target="addon:${serviceSlug}:analytics" title="${removeTitle}">×</button>
      </div>
    ` : '';
    
    return `
      <div class="tl-visual-stack-vertical">
        ${mainPageHtml}
        ${analyticsHtml}
      </div>
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
    const hasExtraServices = state.extraServices && state.extraServices.size > 0;
    
    if (selectedServices.length === 0 && !hasExtraServices) {
      return `<p class="tl-summary-empty" data-i18n="summary.empty">${t('summary.empty', state.lang)}</p>`;
    }
    
    let html = '';
    
    // Render main services (webdesign)
    html += selectedServices.map(serviceSlug => {
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
              ${addonConfig
                .filter(a => selection.addons.has(a.slug))
                .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
                .map(addon => {
                  const addonName = getLocalizedName(addon, state.lang);
                  return `
                    <span class="tl-summary-addon">
                      ${addon.icon} ${addonName}
                      <button data-action="remove" data-target="addon:${serviceSlug}:${addon.slug}">×</button>
                    </span>
                  `;
                }).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // Render extra services
    if (hasExtraServices) {
      const extraServicesList = configData.extraServices || [];
      html += [...state.extraServices].map(extraSlug => {
        const extraService = extraServicesList.find(s => s.slug === extraSlug);
        if (!extraService) return '';
        
        const name = state.lang === 'en' ? extraService.nameEn : extraService.name;
        
        return `
          <div class="tl-summary-service tl-summary-extra" data-summary-extra="${extraSlug}">
            <div class="tl-summary-service-header">
              <div class="tl-summary-service-name">
                <span>${extraService.icon}</span>
                ${name}
              </div>
              <button class="tl-summary-remove" data-action="toggle-extra-service" data-extra-service="${extraSlug}">×</button>
            </div>
          </div>
        `;
      }).join('');
    }
    
    return html;
  }
  
  /**
   * Cache element references
   */
  function cacheElements() {
    elements = {
      mainContent: rootElement.querySelector('[data-main-content]'),
      optionsSidebar: rootElement.querySelector('[data-options-sidebar]'),
      optionalFeatures: rootElement.querySelector('[data-optional-features]'),
      summary: rootElement.querySelector('[data-summary]'),
      summaryContent: rootElement.querySelector('[data-summary-content]'),
      submitSection: rootElement.querySelector('[data-submit-section]'),
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
      updateAllContent(newState);
      updateLangToggle(newState.lang);
      return;
    }
    
    // Step changed - re-render main content
    if (newState.currentStep !== prevState.currentStep) {
      updateAllContent(newState);
      return;
    }
    
    // Selections or extra services changed
    if (newState.selections !== prevState.selections || 
        newState.extraServices !== prevState.extraServices) {
      updateAllContent(newState);
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
   * Update all content based on state changes
   * @param {Object} state - Current state
   */
  function updateAllContent(state) {
    // Update main content area
    if (elements.mainContent) {
      elements.mainContent.innerHTML = renderMainContent(state);
    }
    
    // Update options sidebar
    if (elements.optionsSidebar) {
      elements.optionsSidebar.innerHTML = renderOptionsSidebar(state);
    }
    
    // Update optional features
    if (elements.optionalFeatures) {
      elements.optionalFeatures.innerHTML = renderOptionalFeatures(state);
    }
    
    // Update summary
    if (elements.summaryContent) {
      elements.summaryContent.innerHTML = renderSummaryContent(state);
    }
    
    // Update action buttons
    if (elements.submitSection) {
      const submitStatus = elements.submitSection.querySelector('[data-submit-status]');
      const validationErrors = elements.submitSection.querySelector('[data-validation-errors]');
      elements.submitSection.innerHTML = `
        <div class="tl-validation-errors" data-validation-errors>${validationErrors?.innerHTML || ''}</div>
        ${renderActionButtons(state)}
        <div class="tl-submit-status" data-submit-status>${submitStatus?.innerHTML || ''}</div>
      `;
      // Re-cache the submit button
      elements.submitBtn = elements.submitSection.querySelector('[data-submit-btn]');
      elements.submitStatus = elements.submitSection.querySelector('[data-submit-status]');
      elements.validationErrors = elements.submitSection.querySelector('[data-validation-errors]');
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
