/**
 * State Store - Central state management with pub/sub
 */

/**
 * Create initial state
 * @param {string} defaultLang - Default language ('de' or 'en')
 * @returns {Object} Initial state
 */
export function createInitialState(defaultLang = 'de') {
  return {
    lang: defaultLang,
    selections: {},  // Record<serviceSlug, ServiceSelection>
    lastInteractionTime: Date.now(),
    isSubmitting: false,
    submitStatus: 'idle', // 'idle' | 'success' | 'error'
    validationErrors: [], // Array of { serviceSlug, field, message }
    suggestionVisible: false,
    currentSuggestion: null
  };
}

/**
 * Create a store with state management
 * @param {Function} reducer - Reducer function
 * @param {Object} initialState - Initial state
 * @returns {Object} Store with getState, dispatch, subscribe
 */
export function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  
  return {
    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
      return state;
    },
    
    /**
     * Dispatch an action to update state
     * @param {Object} action - Action object with type and payload
     * @returns {Object} The dispatched action
     */
    dispatch(action) {
      const prevState = state;
      state = reducer(state, action);
      
      // Only notify if state actually changed
      if (state !== prevState) {
        listeners.forEach(listener => listener(state, prevState, action));
      }
      
      return action;
    },
    
    /**
     * Subscribe to state changes
     * @param {Function} listener - Callback function(newState, prevState, action)
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    
    /**
     * Replace the current state (use carefully)
     * @param {Object} newState - New state to set
     */
    replaceState(newState) {
      const prevState = state;
      state = newState;
      listeners.forEach(listener => listener(state, prevState, { type: 'REPLACE_STATE' }));
    }
  };
}

export default { createStore, createInitialState };
