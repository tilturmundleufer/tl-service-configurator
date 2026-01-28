/**
 * Internationalization (i18n) utilities
 */

/**
 * Static UI translations
 */
export const translations = {
  de: {
    // Headers
    'title': 'Service Konfigurator',
    'subtitle': 'Stellen Sie Ihr individuelles Angebot zusammen',
    
    // Sections
    'services.title': 'Wählen Sie Ihre Services',
    'services.subtitle': 'Klicken Sie auf die gewünschten Services',
    'size.title': 'Wählen Sie die Größe',
    'addons.title': 'Zusätzliche Optionen',
    'summary.title': 'Ihre Auswahl',
    'summary.empty': 'Noch keine Services ausgewählt',
    
    // Buttons
    'submit': 'Angebot anfordern',
    'submitting': 'Wird gesendet...',
    'reset': 'Zurücksetzen',
    'remove': 'Entfernen',
    
    // Status messages
    'success.title': 'Vielen Dank!',
    'success.message': 'Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.',
    'error.title': 'Fehler',
    'error.message': 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    'error.retry': 'Erneut versuchen',
    
    // Validation
    'validation.selectService': 'Bitte wählen Sie mindestens einen Service aus',
    'validation.selectSize': 'Bitte wählen Sie eine Größe für',
    
    // Language toggle
    'lang.de': 'DE',
    'lang.en': 'EN',
    'lang.switch': 'Sprache wechseln',
    
    // Suggestion
    'suggestion.prefix': 'Tipp: ',
    'suggestion.dismiss': 'Verstanden',
    
    // Accessibility
    'a11y.removeService': 'Service entfernen',
    'a11y.removeAddon': 'Add-on entfernen',
    'a11y.selectSize': 'Größe auswählen',
    'a11y.toggleAddon': 'Add-on auswählen oder abwählen'
  },
  
  en: {
    // Headers
    'title': 'Service Configurator',
    'subtitle': 'Build your custom offer',
    
    // Sections
    'services.title': 'Select Your Services',
    'services.subtitle': 'Click on the desired services',
    'size.title': 'Select Size',
    'addons.title': 'Additional Options',
    'summary.title': 'Your Selection',
    'summary.empty': 'No services selected yet',
    
    // Buttons
    'submit': 'Request Offer',
    'submitting': 'Sending...',
    'reset': 'Reset',
    'remove': 'Remove',
    
    // Status messages
    'success.title': 'Thank You!',
    'success.message': 'Your request has been sent successfully. We will contact you shortly.',
    'error.title': 'Error',
    'error.message': 'An error occurred. Please try again.',
    'error.retry': 'Try Again',
    
    // Validation
    'validation.selectService': 'Please select at least one service',
    'validation.selectSize': 'Please select a size for',
    
    // Language toggle
    'lang.de': 'DE',
    'lang.en': 'EN',
    'lang.switch': 'Switch language',
    
    // Suggestion
    'suggestion.prefix': 'Tip: ',
    'suggestion.dismiss': 'Got it',
    
    // Accessibility
    'a11y.removeService': 'Remove service',
    'a11y.removeAddon': 'Remove add-on',
    'a11y.selectSize': 'Select size',
    'a11y.toggleAddon': 'Select or deselect add-on'
  }
};

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {string} lang - Language code ('de' or 'en')
 * @returns {string} Translated string
 */
export function t(key, lang = 'de') {
  const langTranslations = translations[lang] || translations.de;
  return langTranslations[key] || translations.de[key] || key;
}

/**
 * Get localized name from an object with name/nameEn fields
 * @param {Object} item - Object with name and nameEn properties
 * @param {string} lang - Language code
 * @returns {string} Localized name
 */
export function getLocalizedName(item, lang) {
  if (!item) return '';
  return lang === 'en' ? (item.nameEn || item.name) : item.name;
}

/**
 * Get localized description from an object
 * @param {Object} item - Object with description and descriptionEn properties
 * @param {string} lang - Language code
 * @returns {string} Localized description
 */
export function getLocalizedDescription(item, lang) {
  if (!item) return '';
  return lang === 'en' ? (item.descriptionEn || item.description) : item.description;
}

/**
 * Detect browser language
 * @param {string} defaultLang - Default language if detection fails
 * @returns {string} Detected language code ('de' or 'en')
 */
export function detectBrowserLanguage(defaultLang = 'de') {
  try {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const langCode = browserLang.split('-')[0].toLowerCase();
      if (langCode === 'de' || langCode === 'en') {
        return langCode;
      }
    }
  } catch (e) {
    console.warn('Language detection failed:', e);
  }
  return defaultLang;
}

/**
 * Update all text elements with data-i18n attribute
 * @param {Element} root - Root element to search within
 * @param {string} lang - Language code
 */
export function updateAllTranslations(root, lang) {
  const elements = root.querySelectorAll('[data-i18n]');
  
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key, lang);
    
    // Check for attribute targets (e.g., data-i18n-attr="placeholder")
    const attrTarget = el.getAttribute('data-i18n-attr');
    
    if (attrTarget) {
      el.setAttribute(attrTarget, translation);
    } else {
      el.textContent = translation;
    }
  });
}

/**
 * Create i18n-aware text node with automatic updates
 * @param {string} key - Translation key
 * @param {Function} getLang - Function to get current language
 * @returns {Object} Object with element and update method
 */
export function createI18nText(key, getLang) {
  const span = document.createElement('span');
  span.setAttribute('data-i18n', key);
  span.textContent = t(key, getLang());
  
  return {
    element: span,
    update() {
      span.textContent = t(key, getLang());
    }
  };
}

export default {
  translations,
  t,
  getLocalizedName,
  getLocalizedDescription,
  detectBrowserLanguage,
  updateAllTranslations,
  createI18nText
};
