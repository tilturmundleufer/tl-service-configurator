/**
 * State Reducer - Handles all state transitions with dependency cascade logic
 */

/**
 * Action Types
 */
export const ActionTypes = {
  TOGGLE_SERVICE: 'TOGGLE_SERVICE',
  EXPAND_SERVICE: 'EXPAND_SERVICE',
  COLLAPSE_SERVICE: 'COLLAPSE_SERVICE',
  SELECT_TAB: 'SELECT_TAB',
  SET_SIZE: 'SET_SIZE',
  TOGGLE_ADDON: 'TOGGLE_ADDON',
  REMOVE_SERVICE: 'REMOVE_SERVICE',
  REMOVE_ADDON: 'REMOVE_ADDON',
  SET_LANG: 'SET_LANG',
  RECORD_INTERACTION: 'RECORD_INTERACTION',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_SUBMIT_STATUS: 'SET_SUBMIT_STATUS',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
  CLEAR_VALIDATION_ERRORS: 'CLEAR_VALIDATION_ERRORS',
  SHOW_SUGGESTION: 'SHOW_SUGGESTION',
  HIDE_SUGGESTION: 'HIDE_SUGGESTION',
  RESET: 'RESET'
};

/**
 * Action Creators
 */
export const actions = {
  toggleService: (serviceSlug) => ({
    type: ActionTypes.TOGGLE_SERVICE,
    payload: { serviceSlug }
  }),
  
  expandService: (serviceSlug) => ({
    type: ActionTypes.EXPAND_SERVICE,
    payload: { serviceSlug }
  }),
  
  collapseService: (serviceSlug) => ({
    type: ActionTypes.COLLAPSE_SERVICE,
    payload: { serviceSlug }
  }),
  
  selectTab: (serviceSlug) => ({
    type: ActionTypes.SELECT_TAB,
    payload: { serviceSlug }
  }),
  
  setSize: (serviceSlug, sizeSlug) => ({
    type: ActionTypes.SET_SIZE,
    payload: { serviceSlug, sizeSlug }
  }),
  
  toggleAddon: (serviceSlug, addonSlug) => ({
    type: ActionTypes.TOGGLE_ADDON,
    payload: { serviceSlug, addonSlug }
  }),
  
  removeService: (serviceSlug) => ({
    type: ActionTypes.REMOVE_SERVICE,
    payload: { serviceSlug }
  }),
  
  removeAddon: (serviceSlug, addonSlug) => ({
    type: ActionTypes.REMOVE_ADDON,
    payload: { serviceSlug, addonSlug }
  }),
  
  setLang: (lang) => ({
    type: ActionTypes.SET_LANG,
    payload: { lang }
  }),
  
  recordInteraction: () => ({
    type: ActionTypes.RECORD_INTERACTION
  }),
  
  setSubmitting: (value) => ({
    type: ActionTypes.SET_SUBMITTING,
    payload: { value }
  }),
  
  setSubmitStatus: (status) => ({
    type: ActionTypes.SET_SUBMIT_STATUS,
    payload: { status }
  }),
  
  setValidationErrors: (errors) => ({
    type: ActionTypes.SET_VALIDATION_ERRORS,
    payload: { errors }
  }),
  
  clearValidationErrors: () => ({
    type: ActionTypes.CLEAR_VALIDATION_ERRORS
  }),
  
  showSuggestion: (suggestion) => ({
    type: ActionTypes.SHOW_SUGGESTION,
    payload: { suggestion }
  }),
  
  hideSuggestion: () => ({
    type: ActionTypes.HIDE_SUGGESTION
  }),
  
  reset: () => ({
    type: ActionTypes.RESET
  })
};

/**
 * Find all addons that depend on a given addon (direct and transitive)
 * @param {string} addonSlug - The addon being removed
 * @param {Array} addonConfig - All addons for this service
 * @returns {Set<string>} Set of addon slugs to remove
 */
function findDependentAddons(addonSlug, addonConfig) {
  const toRemove = new Set([addonSlug]);
  
  // Iteratively find all dependents
  let changed = true;
  while (changed) {
    changed = false;
    for (const addon of addonConfig) {
      if (addon.requiresAddon && toRemove.has(addon.requiresAddon) && !toRemove.has(addon.slug)) {
        toRemove.add(addon.slug);
        changed = true;
      }
    }
  }
  
  return toRemove;
}

/**
 * Check if an addon can be added (dependency satisfied)
 * @param {Object} selection - Current service selection
 * @param {Object} addon - Addon to check
 * @returns {boolean} Whether the addon can be added
 */
export function canAddAddon(selection, addon) {
  if (!addon.requiresAddon) return true;
  return selection.addons.has(addon.requiresAddon);
}

/**
 * Create a reducer with config data for dependency resolution
 * @param {Object} configData - Configuration data with addons
 * @param {Object} initialState - Initial state to use for reset
 * @returns {Function} Reducer function
 */
export function createReducer(configData, initialState) {
  return function reducer(state, action) {
    switch (action.type) {
      case ActionTypes.TOGGLE_SERVICE: {
        const { serviceSlug } = action.payload;
        const isSelected = serviceSlug in state.selections;
        
        if (isSelected) {
          // Remove service and all its data
          const newSelections = { ...state.selections };
          delete newSelections[serviceSlug];
          return {
            ...state,
            selections: newSelections,
            expandedService: state.expandedService === serviceSlug ? null : state.expandedService
          };
        } else {
          // Add service with empty selection
          return {
            ...state,
            selections: {
              ...state.selections,
              [serviceSlug]: {
                serviceSlug,
                size: null,
                addons: new Set()
              }
            },
            expandedService: serviceSlug // Expand the newly selected service
          };
        }
      }
      
      case ActionTypes.EXPAND_SERVICE: {
        const { serviceSlug } = action.payload;
        const isSelected = serviceSlug in state.selections;
        const isCurrentlyExpanded = state.expandedService === serviceSlug;
        
        // If already expanded, collapse it
        if (isCurrentlyExpanded) {
          return {
            ...state,
            expandedService: null
          };
        }
        
        // If not selected yet, select and expand
        if (!isSelected) {
          return {
            ...state,
            selections: {
              ...state.selections,
              [serviceSlug]: {
                serviceSlug,
                size: null,
                addons: new Set()
              }
            },
            expandedService: serviceSlug
          };
        }
        
        // If already selected, just expand
        return {
          ...state,
          expandedService: serviceSlug
        };
      }
      
      case ActionTypes.COLLAPSE_SERVICE: {
        return {
          ...state,
          expandedService: null
        };
      }
      
      case ActionTypes.SELECT_TAB: {
        const { serviceSlug } = action.payload;
        return {
          ...state,
          expandedService: serviceSlug
        };
      }
      
      case ActionTypes.SET_SIZE: {
        const { serviceSlug, sizeSlug } = action.payload;
        const selection = state.selections[serviceSlug];
        
        if (!selection) return state;
        
        // If same size selected, deselect it
        if (selection.size === sizeSlug) {
          return {
            ...state,
            selections: {
              ...state.selections,
              [serviceSlug]: {
                ...selection,
                size: null,
                addons: new Set() // Clear addons when size is removed
              }
            }
          };
        }
        
        return {
          ...state,
          selections: {
            ...state.selections,
            [serviceSlug]: {
              ...selection,
              size: sizeSlug
            }
          }
        };
      }
      
      case ActionTypes.TOGGLE_ADDON: {
        const { serviceSlug, addonSlug } = action.payload;
        const selection = state.selections[serviceSlug];
        
        if (!selection || !selection.size) return state;
        
        const addonConfig = configData.addons[serviceSlug] || [];
        const addon = addonConfig.find(a => a.slug === addonSlug);
        
        if (!addon) return state;
        
        const newAddons = new Set(selection.addons);
        
        if (newAddons.has(addonSlug)) {
          // Remove addon and all dependents (cascade)
          const toRemove = findDependentAddons(addonSlug, addonConfig);
          toRemove.forEach(slug => newAddons.delete(slug));
        } else {
          // Add addon if dependency is satisfied
          if (canAddAddon(selection, addon)) {
            newAddons.add(addonSlug);
          } else {
            // Dependency not satisfied, don't add
            return state;
          }
        }
        
        return {
          ...state,
          selections: {
            ...state.selections,
            [serviceSlug]: {
              ...selection,
              addons: newAddons
            }
          }
        };
      }
      
      case ActionTypes.REMOVE_SERVICE: {
        const { serviceSlug } = action.payload;
        const newSelections = { ...state.selections };
        delete newSelections[serviceSlug];
        
        return {
          ...state,
          selections: newSelections
        };
      }
      
      case ActionTypes.REMOVE_ADDON: {
        const { serviceSlug, addonSlug } = action.payload;
        const selection = state.selections[serviceSlug];
        
        if (!selection) return state;
        
        const addonConfig = configData.addons[serviceSlug] || [];
        const toRemove = findDependentAddons(addonSlug, addonConfig);
        
        const newAddons = new Set(
          [...selection.addons].filter(a => !toRemove.has(a))
        );
        
        return {
          ...state,
          selections: {
            ...state.selections,
            [serviceSlug]: {
              ...selection,
              addons: newAddons
            }
          }
        };
      }
      
      case ActionTypes.SET_LANG: {
        return {
          ...state,
          lang: action.payload.lang
        };
      }
      
      case ActionTypes.RECORD_INTERACTION: {
        return {
          ...state,
          lastInteractionTime: Date.now(),
          suggestionVisible: false // Hide suggestion on interaction
        };
      }
      
      case ActionTypes.SET_SUBMITTING: {
        return {
          ...state,
          isSubmitting: action.payload.value
        };
      }
      
      case ActionTypes.SET_SUBMIT_STATUS: {
        return {
          ...state,
          submitStatus: action.payload.status
        };
      }
      
      case ActionTypes.SET_VALIDATION_ERRORS: {
        return {
          ...state,
          validationErrors: action.payload.errors
        };
      }
      
      case ActionTypes.CLEAR_VALIDATION_ERRORS: {
        return {
          ...state,
          validationErrors: []
        };
      }
      
      case ActionTypes.SHOW_SUGGESTION: {
        return {
          ...state,
          suggestionVisible: true,
          currentSuggestion: action.payload.suggestion
        };
      }
      
      case ActionTypes.HIDE_SUGGESTION: {
        return {
          ...state,
          suggestionVisible: false,
          currentSuggestion: null
        };
      }
      
      case ActionTypes.RESET: {
        return { ...initialState };
      }
      
      default:
        return state;
    }
  };
}

export default { ActionTypes, actions, createReducer, canAddAddon };
