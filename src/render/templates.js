/**
 * Template Management - Clone and populate templates for UI elements
 */

import { escapeHtml } from '../utils/helpers.js';

/**
 * Template cache to avoid repeated DOM queries
 */
const templateCache = new Map();

/**
 * Get or create a template from the DOM
 * @param {string} selector - Template selector
 * @returns {HTMLTemplateElement|null} Template element or null
 */
function getTemplate(selector) {
  if (templateCache.has(selector)) {
    return templateCache.get(selector);
  }
  
  const template = document.querySelector(selector);
  if (template) {
    templateCache.set(selector, template);
  }
  return template;
}

/**
 * Create fallback templates if not found in DOM
 * These are used when Webflow templates aren't available
 */
export function createFallbackTemplates() {
  const container = document.createElement('div');
  container.style.display = 'none';
  container.innerHTML = `
    <!-- Service Card Template -->
    <template data-template="service-card">
      <button class="tl-service-card" data-service="" data-action="toggle-service">
        <span class="tl-service-icon" data-service-icon></span>
        <span class="tl-service-name" data-service-name></span>
        <span class="tl-service-check">✓</span>
      </button>
    </template>
    
    <!-- Service Build Area Template -->
    <template data-template="service-build">
      <div class="tl-service-build" data-service-build="">
        <div class="tl-build-header">
          <span class="tl-build-title" data-build-title></span>
          <button class="tl-build-remove" data-action="remove" data-target="" aria-label="Remove">×</button>
        </div>
        <div class="tl-size-selector" data-size-selector></div>
        <div class="tl-visual-container" data-visual-container></div>
        <div class="tl-addons-container" data-addons-container></div>
      </div>
    </template>
    
    <!-- Size Button Template -->
    <template data-template="size-btn">
      <button class="tl-size-btn" data-size="" data-for-service="" data-action="set-size">
        <span data-size-name></span>
      </button>
    </template>
    
    <!-- Page Card Template (for webdesign visual) -->
    <template data-template="page-card">
      <div class="tl-page-card">
        <span class="tl-page-number" data-page-number></span>
        <span class="tl-page-label">Seite</span>
      </div>
    </template>
    
    <!-- Module Card Template -->
    <template data-template="module-card">
      <div class="tl-module-card">
        <span class="tl-module-icon" data-module-icon></span>
        <span class="tl-module-name" data-module-name></span>
      </div>
    </template>
    
    <!-- Addon Button Template -->
    <template data-template="addon-btn">
      <button class="tl-addon-btn" data-addon="" data-for-service="" data-action="toggle-addon">
        <span class="tl-addon-icon" data-addon-icon></span>
        <span class="tl-addon-name" data-addon-name></span>
        <span class="tl-addon-check">✓</span>
      </button>
    </template>
    
    <!-- Summary Chip Template -->
    <template data-template="summary-chip">
      <div class="tl-summary-chip" data-chip="">
        <span class="tl-chip-text" data-chip-text></span>
        <button class="tl-chip-remove" data-action="remove" data-target="" aria-label="Remove">×</button>
      </div>
    </template>
    
    <!-- Suggestion Toast Template -->
    <template data-template="suggestion">
      <div class="tl-suggestion-toast">
        <span class="tl-suggestion-icon">💡</span>
        <span class="tl-suggestion-text" data-suggestion-text></span>
        <button class="tl-suggestion-dismiss" data-action="dismiss-suggestion">×</button>
      </div>
    </template>
    
    <!-- Addon Visual Card Template -->
    <template data-template="addon-visual-card">
      <div class="tl-addon-visual" data-addon-visual="">
        <span class="tl-addon-visual-icon" data-addon-visual-icon></span>
        <span class="tl-addon-visual-name" data-addon-visual-name></span>
      </div>
    </template>
    
    <!-- Addon Badge Template -->
    <template data-template="addon-badge">
      <span class="tl-addon-badge" data-addon-badge="">
        <span data-badge-text></span>
      </span>
    </template>
    
    <!-- Addon Section Template -->
    <template data-template="addon-section">
      <div class="tl-addon-section" data-addon-section="">
        <div class="tl-addon-section-header">
          <span class="tl-addon-section-icon" data-section-icon></span>
          <span class="tl-addon-section-name" data-section-name></span>
        </div>
      </div>
    </template>
  `;
  
  document.body.appendChild(container);
  
  // Clear cache to pick up new templates
  templateCache.clear();
}

/**
 * Clone a template and return the cloned content
 * @param {string} templateName - Template name (without 'data-template=' prefix)
 * @returns {DocumentFragment|null} Cloned content or null
 */
export function cloneTemplate(templateName) {
  const selector = `[data-template="${templateName}"]`;
  const template = getTemplate(selector);
  
  if (!template) {
    console.warn(`Template not found: ${templateName}`);
    return null;
  }
  
  return template.content.cloneNode(true);
}

/**
 * Create a service card element
 * @param {Object} service - Service data
 * @param {string} lang - Current language
 * @param {boolean} isSelected - Whether service is selected
 * @returns {Element} Service card element
 */
export function createServiceCard(service, lang, isSelected = false) {
  const fragment = cloneTemplate('service-card');
  if (!fragment) return null;
  
  const card = fragment.querySelector('[data-service]') || fragment.firstElementChild;
  const name = lang === 'en' ? service.nameEn : service.name;
  
  card.setAttribute('data-service', service.slug);
  card.querySelector('[data-service-icon]').textContent = service.icon || '📦';
  card.querySelector('[data-service-name]').textContent = name;
  
  if (isSelected) {
    card.classList.add('is-selected');
  }
  
  return card;
}

/**
 * Create a service build area element
 * @param {Object} service - Service data
 * @param {string} lang - Current language
 * @returns {Element} Build area element
 */
export function createServiceBuild(service, lang) {
  const fragment = cloneTemplate('service-build');
  if (!fragment) return null;
  
  const build = fragment.querySelector('[data-service-build]') || fragment.firstElementChild;
  const name = lang === 'en' ? service.nameEn : service.name;
  
  build.setAttribute('data-service-build', service.slug);
  build.querySelector('[data-build-title]').textContent = name;
  
  const removeBtn = build.querySelector('[data-action="remove"]');
  if (removeBtn) {
    removeBtn.setAttribute('data-target', `service:${service.slug}`);
  }
  
  return build;
}

/**
 * Create a size button element
 * @param {Object} size - Size data
 * @param {string} serviceSlug - Parent service slug
 * @param {string} lang - Current language
 * @param {boolean} isSelected - Whether size is selected
 * @returns {Element} Size button element
 */
export function createSizeButton(size, serviceSlug, lang, isSelected = false) {
  const fragment = cloneTemplate('size-btn');
  if (!fragment) return null;
  
  const btn = fragment.querySelector('[data-size]') || fragment.firstElementChild;
  const name = lang === 'en' ? size.nameEn : size.name;
  
  btn.setAttribute('data-size', size.slug);
  btn.setAttribute('data-for-service', serviceSlug);
  btn.querySelector('[data-size-name]').textContent = name;
  
  if (isSelected) {
    btn.classList.add('is-selected');
  }
  
  return btn;
}

/**
 * Create visual page cards
 * @param {number} count - Number of pages
 * @param {string} lang - Current language
 * @returns {DocumentFragment} Fragment with page cards
 */
export function createPageCards(count, lang) {
  const fragment = document.createDocumentFragment();
  const maxVisible = Math.min(count, 10); // Cap at 10 for performance
  
  for (let i = 1; i <= maxVisible; i++) {
    const cardFragment = cloneTemplate('page-card');
    if (cardFragment) {
      const card = cardFragment.querySelector('.tl-page-card') || cardFragment.firstElementChild;
      card.querySelector('[data-page-number]').textContent = i;
      card.style.setProperty('--animation-delay', `${(i - 1) * 50}ms`);
      fragment.appendChild(card);
    }
  }
  
  if (count > maxVisible) {
    const more = document.createElement('div');
    more.className = 'tl-page-card tl-page-more';
    more.textContent = `+${count - maxVisible}`;
    fragment.appendChild(more);
  }
  
  return fragment;
}

/**
 * Create visual module cards
 * @param {number} count - Number of modules
 * @param {string} lang - Current language
 * @returns {DocumentFragment} Fragment with module cards
 */
export function createModuleCards(count, lang) {
  const fragment = document.createDocumentFragment();
  const moduleNames = lang === 'en' 
    ? ['Module', 'Component', 'Feature', 'System', 'Integration', 'Platform']
    : ['Modul', 'Komponente', 'Feature', 'System', 'Integration', 'Plattform'];
  
  for (let i = 0; i < count; i++) {
    const cardFragment = cloneTemplate('module-card');
    if (cardFragment) {
      const card = cardFragment.querySelector('.tl-module-card') || cardFragment.firstElementChild;
      const iconEl = card.querySelector('[data-module-icon]');
      const nameEl = card.querySelector('[data-module-name]');
      
      if (iconEl) iconEl.textContent = ['⚙️', '🔧', '📊', '🔌', '🎯', '📈'][i % 6];
      if (nameEl) nameEl.textContent = moduleNames[i % moduleNames.length];
      
      card.style.setProperty('--animation-delay', `${i * 50}ms`);
      fragment.appendChild(card);
    }
  }
  
  return fragment;
}

/**
 * Create an addon button element
 * @param {Object} addon - Addon data
 * @param {string} serviceSlug - Parent service slug
 * @param {string} lang - Current language
 * @param {boolean} isSelected - Whether addon is selected
 * @param {boolean} isDisabled - Whether addon is disabled (dependency not met)
 * @returns {Element} Addon button element
 */
export function createAddonButton(addon, serviceSlug, lang, isSelected = false, isDisabled = false) {
  const fragment = cloneTemplate('addon-btn');
  if (!fragment) return null;
  
  const btn = fragment.querySelector('[data-addon]') || fragment.firstElementChild;
  const name = lang === 'en' ? addon.nameEn : addon.name;
  
  btn.setAttribute('data-addon', addon.slug);
  btn.setAttribute('data-for-service', serviceSlug);
  btn.querySelector('[data-addon-icon]').textContent = addon.icon || '➕';
  btn.querySelector('[data-addon-name]').textContent = name;
  
  if (isSelected) {
    btn.classList.add('is-selected');
  }
  
  if (isDisabled) {
    btn.classList.add('is-disabled');
    btn.setAttribute('disabled', 'disabled');
    btn.setAttribute('title', lang === 'en' 
      ? 'Requires another add-on first' 
      : 'Benötigt erst ein anderes Add-on');
  }
  
  return btn;
}

/**
 * Create addon visual element based on visual type
 * @param {Object} addon - Addon data
 * @param {string} lang - Current language
 * @returns {Element} Addon visual element
 */
export function createAddonVisual(addon, lang) {
  const name = lang === 'en' ? addon.nameEn : addon.name;
  
  switch (addon.visualType) {
    case 'section': {
      const fragment = cloneTemplate('addon-section');
      if (!fragment) return null;
      const section = fragment.querySelector('[data-addon-section]') || fragment.firstElementChild;
      section.setAttribute('data-addon-section', addon.slug);
      const iconEl = section.querySelector('[data-section-icon]');
      const nameEl = section.querySelector('[data-section-name]');
      if (iconEl) iconEl.textContent = addon.icon || '📋';
      if (nameEl) nameEl.textContent = name;
      return section;
    }
    
    case 'badge': {
      const fragment = cloneTemplate('addon-badge');
      if (!fragment) return null;
      const badge = fragment.querySelector('[data-addon-badge]') || fragment.firstElementChild;
      badge.setAttribute('data-addon-badge', addon.slug);
      const textEl = badge.querySelector('[data-badge-text]');
      if (textEl) textEl.textContent = name;
      return badge;
    }
    
    case 'card':
    default: {
      const fragment = cloneTemplate('addon-visual-card');
      if (!fragment) return null;
      const card = fragment.querySelector('[data-addon-visual]') || fragment.firstElementChild;
      card.setAttribute('data-addon-visual', addon.slug);
      const iconEl = card.querySelector('[data-addon-visual-icon]');
      const nameEl = card.querySelector('[data-addon-visual-name]');
      if (iconEl) iconEl.textContent = addon.icon || '📦';
      if (nameEl) nameEl.textContent = name;
      return card;
    }
  }
}

/**
 * Create a summary chip element
 * @param {Object} item - Summary item data
 * @returns {Element} Summary chip element
 */
export function createSummaryChip(item) {
  const fragment = cloneTemplate('summary-chip');
  if (!fragment) return null;
  
  const chip = fragment.querySelector('[data-chip]') || fragment.firstElementChild;
  
  chip.setAttribute('data-chip', `${item.type}:${item.serviceSlug}:${item.slug}`);
  chip.classList.add(`tl-chip-${item.type}`);
  chip.querySelector('[data-chip-text]').textContent = item.name;
  
  const removeBtn = chip.querySelector('[data-action="remove"]');
  if (removeBtn) {
    if (item.removeTarget) {
      removeBtn.setAttribute('data-target', item.removeTarget);
    } else {
      removeBtn.style.display = 'none';
    }
  }
  
  return chip;
}

/**
 * Create suggestion toast element
 * @param {Object} suggestion - Suggestion data
 * @returns {Element} Suggestion toast element
 */
export function createSuggestionToast(suggestion) {
  const fragment = cloneTemplate('suggestion');
  if (!fragment) return null;
  
  const toast = fragment.querySelector('.tl-suggestion-toast') || fragment.firstElementChild;
  const textEl = toast.querySelector('[data-suggestion-text]');
  
  if (textEl) {
    textEl.textContent = suggestion.text;
  }
  
  toast.setAttribute('data-suggestion-service', suggestion.serviceSlug);
  toast.setAttribute('data-suggestion-addon', suggestion.addonSlug);
  
  return toast;
}

export default {
  createFallbackTemplates,
  cloneTemplate,
  createServiceCard,
  createServiceBuild,
  createSizeButton,
  createPageCards,
  createModuleCards,
  createAddonButton,
  createAddonVisual,
  createSummaryChip,
  createSuggestionToast
};
