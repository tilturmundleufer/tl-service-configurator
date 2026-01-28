/**
 * Submission Logic - Payload building and webhook submission
 */

import { CONFIG } from '../config.js';
import { getOrCreateSessionId, serializeSelections } from '../utils/helpers.js';
import { getLocalizedName } from '../utils/i18n.js';
import * as selectors from '../state/selectors.js';
import { actions } from '../state/reducer.js';

/**
 * Build the submission payload from state
 * @param {Object} state - Current state
 * @param {Object} configData - CMS configuration data
 * @returns {Object} Submission payload
 */
export function buildPayload(state, configData) {
  const lang = state.lang;
  const sessionId = getOrCreateSessionId();
  
  // Build services array
  const services = Object.values(state.selections)
    .filter(sel => sel.size) // Only include complete selections
    .map(sel => {
      const service = configData.services.find(s => s.slug === sel.serviceSlug);
      const sizes = configData.sizes[sel.serviceSlug] || [];
      const size = sizes.find(s => s.slug === sel.size);
      const addonConfig = configData.addons[sel.serviceSlug] || [];
      
      const serviceName = service ? getLocalizedName(service, lang) : sel.serviceSlug;
      const sizeName = size ? getLocalizedName(size, lang) : sel.size;
      
      const addons = [...sel.addons].map(addonSlug => {
        const addon = addonConfig.find(a => a.slug === addonSlug);
        return {
          id: addonSlug,
          name: addon ? getLocalizedName(addon, lang) : addonSlug
        };
      });
      
      // Build summary string
      const parts = [sizeName, ...addons.map(a => a.name)];
      const summary = `${serviceName}: ${parts.join(' + ')}`;
      
      return {
        id: sel.serviceSlug,
        name: serviceName,
        size: {
          id: sel.size,
          name: sizeName
        },
        addons,
        summary
      };
    });
  
  // Build human-readable summary
  const humanSummary = services.map(s => {
    const addonText = s.addons.length > 0 
      ? ` (${s.size.name} + ${s.addons.map(a => a.name).join(' + ')})` 
      : ` (${s.size.name})`;
    return s.name + addonText;
  }).join(', ');
  
  return {
    meta: {
      timestamp: new Date().toISOString(),
      sourceUrl: window.location.href,
      lang,
      userAgent: navigator.userAgent,
      sessionId
    },
    services,
    humanSummary,
    rawConfig: JSON.stringify(serializeSelections(state.selections))
  };
}

/**
 * Validate the payload before submission
 * @param {Object} payload - Submission payload
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validatePayload(payload) {
  const errors = [];
  
  if (!payload.services || payload.services.length === 0) {
    errors.push('No services selected');
  }
  
  for (const service of payload.services || []) {
    if (!service.id) {
      errors.push('Service missing ID');
    }
    if (!service.size || !service.size.id) {
      errors.push(`Service ${service.id} missing size`);
    }
  }
  
  if (!payload.meta || !payload.meta.sessionId) {
    errors.push('Missing session ID');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Submit the payload to the webhook
 * @param {Object} payload - Submission payload
 * @param {string} webhookUrl - Webhook URL
 * @param {Object} options - Submit options
 * @returns {Promise<Object>} Result { success: boolean, error?: string }
 */
export async function submitToWebhook(payload, webhookUrl, options = {}) {
  const { retries = 2, retryDelay = 1000 } = options;
  
  // Check for duplicate submission
  const lastSubmissionKey = 'tl-configurator-last-submission';
  const lastSubmission = localStorage.getItem(lastSubmissionKey);
  
  if (lastSubmission === payload.meta.sessionId) {
    console.warn('Duplicate submission prevented');
    return { success: false, error: 'duplicate', isDuplicate: true };
  }
  
  // Validate payload
  const validation = validatePayload(payload);
  if (!validation.valid) {
    console.error('Invalid payload:', validation.errors);
    return { success: false, error: validation.errors.join(', ') };
  }
  
  // Attempt submission with retries
  let lastError = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Success - store session ID to prevent duplicates
      localStorage.setItem(lastSubmissionKey, payload.meta.sessionId);
      
      // Try to parse response
      let responseData = null;
      try {
        const text = await response.text();
        if (text) {
          responseData = JSON.parse(text);
        }
      } catch (e) {
        // Response might be empty or not JSON - that's OK
      }
      
      return { success: true, data: responseData };
      
    } catch (error) {
      lastError = error;
      console.warn(`Submission attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < retries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }
  
  return { success: false, error: lastError?.message || 'Unknown error' };
}

/**
 * Create the submission handler function
 * @param {Object} store - State store
 * @param {Object} configData - CMS configuration data
 * @param {string} webhookUrl - Webhook URL
 * @returns {Function} Submit handler function
 */
export function createSubmitHandler(store, configData, webhookUrl) {
  return async function handleSubmit(state) {
    // Set submitting state
    store.dispatch(actions.setSubmitting(true));
    store.dispatch(actions.setSubmitStatus('idle'));
    
    try {
      // Build payload
      const payload = buildPayload(state, configData);
      
      console.log('Submitting payload:', payload);
      
      // Submit to webhook
      const result = await submitToWebhook(payload, webhookUrl);
      
      if (result.success) {
        store.dispatch(actions.setSubmitStatus('success'));
        
        // Optional: Reset form after success
        // setTimeout(() => {
        //   store.dispatch(actions.reset());
        // }, 3000);
        
        // Track success event (if analytics available)
        if (typeof gtag === 'function') {
          gtag('event', 'form_submit', {
            event_category: 'configurator',
            event_label: 'success',
            value: payload.services.length
          });
        }
        
      } else if (result.isDuplicate) {
        // Show success for duplicates (they already submitted)
        store.dispatch(actions.setSubmitStatus('success'));
      } else {
        store.dispatch(actions.setSubmitStatus('error'));
        console.error('Submission failed:', result.error);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      store.dispatch(actions.setSubmitStatus('error'));
    } finally {
      store.dispatch(actions.setSubmitting(false));
    }
  };
}

/**
 * Format payload as plain text for debugging/logging
 * @param {Object} payload - Submission payload
 * @returns {string} Formatted text
 */
export function formatPayloadAsText(payload) {
  const lines = [
    `=== Configurator Submission ===`,
    `Timestamp: ${payload.meta.timestamp}`,
    `Language: ${payload.meta.lang}`,
    `Source: ${payload.meta.sourceUrl}`,
    `Session: ${payload.meta.sessionId}`,
    ``,
    `=== Services ===`
  ];
  
  for (const service of payload.services) {
    lines.push(`- ${service.name}`);
    lines.push(`  Size: ${service.size.name}`);
    if (service.addons.length > 0) {
      lines.push(`  Add-ons: ${service.addons.map(a => a.name).join(', ')}`);
    }
    lines.push(`  Summary: ${service.summary}`);
    lines.push('');
  }
  
  lines.push(`=== Human Summary ===`);
  lines.push(payload.humanSummary);
  
  return lines.join('\n');
}

export default {
  buildPayload,
  validatePayload,
  submitToWebhook,
  createSubmitHandler,
  formatPayloadAsText
};
