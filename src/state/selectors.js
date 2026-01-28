/**
 * State Selectors - Query functions for accessing state data
 */

/**
 * Get all selected service slugs
 * @param {Object} state - Current state
 * @returns {string[]} Array of selected service slugs
 */
export function getSelectedServices(state) {
  return Object.keys(state.selections);
}

/**
 * Check if a service is selected
 * @param {Object} state - Current state
 * @param {string} serviceSlug - Service slug to check
 * @returns {boolean} Whether the service is selected
 */
export function isServiceSelected(state, serviceSlug) {
  return serviceSlug in state.selections;
}

/**
 * Get selection for a specific service
 * @param {Object} state - Current state
 * @param {string} serviceSlug - Service slug
 * @returns {Object|null} Selection object or null
 */
export function getServiceSelection(state, serviceSlug) {
  return state.selections[serviceSlug] || null;
}

/**
 * Get selected size for a service
 * @param {Object} state - Current state
 * @param {string} serviceSlug - Service slug
 * @returns {string|null} Size slug or null
 */
export function getSelectedSize(state, serviceSlug) {
  const selection = state.selections[serviceSlug];
  return selection ? selection.size : null;
}

/**
 * Get selected addons for a service
 * @param {Object} state - Current state
 * @param {string} serviceSlug - Service slug
 * @returns {Set<string>} Set of selected addon slugs
 */
export function getSelectedAddons(state, serviceSlug) {
  const selection = state.selections[serviceSlug];
  return selection ? selection.addons : new Set();
}

/**
 * Check if an addon is selected
 * @param {Object} state - Current state
 * @param {string} serviceSlug - Service slug
 * @param {string} addonSlug - Addon slug
 * @returns {boolean} Whether the addon is selected
 */
export function isAddonSelected(state, serviceSlug, addonSlug) {
  const addons = getSelectedAddons(state, serviceSlug);
  return addons.has(addonSlug);
}

/**
 * Check if configuration is valid (all services have sizes)
 * @param {Object} state - Current state
 * @returns {boolean} Whether configuration is valid
 */
export function isConfigurationValid(state) {
  const services = getSelectedServices(state);
  if (services.length === 0) return false;
  
  return services.every(serviceSlug => {
    const selection = state.selections[serviceSlug];
    return selection && selection.size !== null;
  });
}

/**
 * Get validation errors for current configuration
 * @param {Object} state - Current state
 * @param {Object} configData - Configuration data
 * @returns {Array} Array of validation error objects
 */
export function getValidationErrors(state, configData) {
  const errors = [];
  const services = getSelectedServices(state);
  
  if (services.length === 0) {
    errors.push({
      serviceSlug: null,
      field: 'services',
      message: state.lang === 'de' 
        ? 'Bitte wählen Sie mindestens einen Service aus' 
        : 'Please select at least one service'
    });
    return errors;
  }
  
  for (const serviceSlug of services) {
    const selection = state.selections[serviceSlug];
    const service = configData.services.find(s => s.slug === serviceSlug);
    const serviceName = service 
      ? (state.lang === 'de' ? service.name : service.nameEn)
      : serviceSlug;
    
    if (!selection.size) {
      errors.push({
        serviceSlug,
        field: 'size',
        message: state.lang === 'de'
          ? `Bitte wählen Sie eine Größe für ${serviceName}`
          : `Please select a size for ${serviceName}`
      });
    }
  }
  
  return errors;
}

/**
 * Get total count of selected items (services + addons)
 * @param {Object} state - Current state
 * @returns {number} Total selection count
 */
export function getTotalSelectionCount(state) {
  let count = 0;
  
  for (const selection of Object.values(state.selections)) {
    count += 1; // Service itself
    if (selection.size) count += 1; // Size
    count += selection.addons.size; // Addons
  }
  
  return count;
}

/**
 * Get summary data for all selections
 * @param {Object} state - Current state
 * @param {Object} configData - Configuration data
 * @returns {Array} Array of summary objects
 */
export function getSelectionSummary(state, configData) {
  const summary = [];
  
  for (const [serviceSlug, selection] of Object.entries(state.selections)) {
    const service = configData.services.find(s => s.slug === serviceSlug);
    if (!service) continue;
    
    const serviceName = state.lang === 'de' ? service.name : service.nameEn;
    
    // Service item
    summary.push({
      type: 'service',
      serviceSlug,
      slug: serviceSlug,
      name: serviceName,
      removeTarget: `service:${serviceSlug}`
    });
    
    // Size item
    if (selection.size) {
      const sizes = configData.sizes[serviceSlug] || [];
      const size = sizes.find(s => s.slug === selection.size);
      if (size) {
        const sizeName = state.lang === 'de' ? size.name : size.nameEn;
        summary.push({
          type: 'size',
          serviceSlug,
          slug: selection.size,
          name: `${serviceName}: ${sizeName}`,
          removeTarget: null // Sizes can't be removed individually from summary
        });
      }
    }
    
    // Addon items
    const addonConfig = configData.addons[serviceSlug] || [];
    for (const addonSlug of selection.addons) {
      const addon = addonConfig.find(a => a.slug === addonSlug);
      if (addon) {
        const addonName = state.lang === 'de' ? addon.name : addon.nameEn;
        summary.push({
          type: 'addon',
          serviceSlug,
          slug: addonSlug,
          name: `+ ${addonName}`,
          removeTarget: `addon:${serviceSlug}:${addonSlug}`
        });
      }
    }
  }
  
  return summary;
}

/**
 * Check if there are any incomplete services (selected but no size)
 * @param {Object} state - Current state
 * @returns {boolean} Whether there are incomplete services
 */
export function hasIncompleteServices(state) {
  return Object.values(state.selections).some(selection => !selection.size);
}

/**
 * Get a suggestion for inactivity prompt
 * @param {Object} state - Current state
 * @param {Object} configData - Configuration data
 * @returns {Object|null} Suggestion object or null
 */
export function getSuggestion(state, configData) {
  const services = getSelectedServices(state);
  
  // No suggestion if nothing selected
  if (services.length === 0) return null;
  
  // Find a recommended addon that's not yet selected
  for (const serviceSlug of services) {
    const selection = state.selections[serviceSlug];
    
    // Only suggest if service has a size selected
    if (!selection.size) continue;
    
    const addonConfig = configData.addons[serviceSlug] || [];
    
    for (const addon of addonConfig) {
      if (addon.isRecommended && 
          !selection.addons.has(addon.slug) &&
          addon.suggestionText) {
        
        // Check if dependency is satisfied
        if (addon.requiresAddon && !selection.addons.has(addon.requiresAddon)) {
          continue;
        }
        
        return {
          serviceSlug,
          addonSlug: addon.slug,
          text: state.lang === 'de' ? addon.suggestionText : addon.suggestionTextEn,
          addonName: state.lang === 'de' ? addon.name : addon.nameEn
        };
      }
    }
  }
  
  return null;
}

/**
 * Get the current language
 * @param {Object} state - Current state
 * @returns {string} Current language code
 */
export function getLang(state) {
  return state.lang;
}

/**
 * Check if submission is in progress
 * @param {Object} state - Current state
 * @returns {boolean} Whether submission is in progress
 */
export function isSubmitting(state) {
  return state.isSubmitting;
}

/**
 * Get submission status
 * @param {Object} state - Current state
 * @returns {string} Submit status ('idle', 'success', 'error')
 */
export function getSubmitStatus(state) {
  return state.submitStatus;
}

export default {
  getSelectedServices,
  isServiceSelected,
  getServiceSelection,
  getSelectedSize,
  getSelectedAddons,
  isAddonSelected,
  isConfigurationValid,
  getValidationErrors,
  getTotalSelectionCount,
  getSelectionSummary,
  hasIncompleteServices,
  getSuggestion,
  getLang,
  isSubmitting,
  getSubmitStatus
};
