/**
 * Configuration constants for the service configurator
 */

export const CONFIG = {
  // Make.com webhook URL - replace with actual URL
  webhookUrl: 'https://hook.eu2.make.com/l15ycdsxdmqri2brp6h3ick7b0fl4yef',
  
  // Inactivity timer in milliseconds (12 seconds)
  inactivityTimeout: 12000,
  
  // Suggestion toast auto-hide duration in milliseconds
  suggestionDuration: 8000,
  
  // Default language
  defaultLang: 'de',
  
  // Animation durations in milliseconds
  animations: {
    popIn: 300,
    popOut: 200,
    staggerDelay: 50,
    fadeIn: 200,
    fadeOut: 150
  },
  
  // Selectors for DOM elements
  selectors: {
    root: '[data-configurator]',
    servicesGrid: '[data-services-grid]',
    buildArea: '[data-build-area]',
    summary: '[data-summary]',
    summaryItems: '[data-summary-items]',
    submitBtn: '[data-submit-btn]',
    submitStatus: '[data-submit-status]',
    langToggle: '[data-lang-toggle]',
    suggestionContainer: '[data-suggestion-container]'
  },
  
  // Templates
  templates: {
    serviceCard: '[data-template="service-card"]',
    pageCard: '[data-template="page-card"]',
    moduleCard: '[data-template="module-card"]',
    addonBtn: '[data-template="addon-btn"]',
    summaryChip: '[data-template="summary-chip"]',
    suggestion: '[data-template="suggestion"]',
    serviceBuild: '[data-template="service-build"]',
    sizeBtn: '[data-template="size-btn"]'
  }
};

export default CONFIG;
