var TLConfigurator = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default,
    init: () => init
  });

  // src/config.js
  var CONFIG = {
    // Make.com webhook URL - replace with actual URL
    webhookUrl: "https://hook.eu1.make.com/YOUR_WEBHOOK_ID",
    // Inactivity timer in milliseconds (12 seconds)
    inactivityTimeout: 12e3,
    // Suggestion toast auto-hide duration in milliseconds
    suggestionDuration: 8e3,
    // Default language
    defaultLang: "de",
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
      root: "[data-configurator]",
      servicesGrid: "[data-services-grid]",
      buildArea: "[data-build-area]",
      summary: "[data-summary]",
      summaryItems: "[data-summary-items]",
      submitBtn: "[data-submit-btn]",
      submitStatus: "[data-submit-status]",
      langToggle: "[data-lang-toggle]",
      suggestionContainer: "[data-suggestion-container]"
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

  // src/data/cms-data.js
  var services = [
    {
      slug: "webdesign",
      name: "Webdesign",
      nameEn: "Web Design",
      icon: "\u{1F310}",
      description: "Professionelle Websites mit modernem Design",
      descriptionEn: "Professional websites with modern design",
      visualType: "pages",
      order: 1
    },
    {
      slug: "social_media",
      name: "Social Media Marketing",
      nameEn: "Social Media Marketing",
      icon: "\u{1F4F1}",
      description: "Strategische Social Media Pr\xE4senz",
      descriptionEn: "Strategic social media presence",
      visualType: "modules",
      order: 2
    },
    {
      slug: "recruiting",
      name: "Mitarbeitergewinnung",
      nameEn: "Recruiting",
      icon: "\u{1F465}",
      description: "Effektive Personalgewinnung",
      descriptionEn: "Effective talent acquisition",
      visualType: "cards",
      order: 3
    },
    {
      slug: "webapps",
      name: "Webanwendungen",
      nameEn: "Web Applications",
      icon: "\u26A1",
      description: "Ma\xDFgeschneiderte Web-Apps",
      descriptionEn: "Custom web applications",
      visualType: "modules",
      order: 4
    },
    {
      slug: "automation",
      name: "Lead/Automatisierung",
      nameEn: "Lead/Automation",
      icon: "\u{1F916}",
      description: "Automatisierte Lead-Systeme",
      descriptionEn: "Automated lead systems",
      visualType: "modules",
      order: 5
    }
  ];
  var sizes = {
    webdesign: [
      { slug: "3_pages", name: "3 Seiten", nameEn: "3 Pages", serviceSlug: "webdesign", visualCount: 3, order: 1 },
      { slug: "5_pages", name: "5 Seiten", nameEn: "5 Pages", serviceSlug: "webdesign", visualCount: 5, order: 2 },
      { slug: "10_pages", name: "10 Seiten", nameEn: "10 Pages", serviceSlug: "webdesign", visualCount: 10, order: 3 },
      { slug: "custom_pages", name: "Individuell", nameEn: "Custom", serviceSlug: "webdesign", visualCount: 1, order: 4 }
    ],
    social_media: [
      { slug: "starter", name: "Starter", nameEn: "Starter", serviceSlug: "social_media", visualCount: 2, order: 1 },
      { slug: "professional", name: "Professional", nameEn: "Professional", serviceSlug: "social_media", visualCount: 4, order: 2 },
      { slug: "enterprise", name: "Enterprise", nameEn: "Enterprise", serviceSlug: "social_media", visualCount: 6, order: 3 }
    ],
    recruiting: [
      { slug: "single_position", name: "1 Stelle", nameEn: "1 Position", serviceSlug: "recruiting", visualCount: 1, order: 1 },
      { slug: "multi_position", name: "3-5 Stellen", nameEn: "3-5 Positions", serviceSlug: "recruiting", visualCount: 4, order: 2 },
      { slug: "campaign", name: "Kampagne", nameEn: "Campaign", serviceSlug: "recruiting", visualCount: 6, order: 3 }
    ],
    webapps: [
      { slug: "mvp", name: "MVP", nameEn: "MVP", serviceSlug: "webapps", visualCount: 3, order: 1 },
      { slug: "standard", name: "Standard", nameEn: "Standard", serviceSlug: "webapps", visualCount: 5, order: 2 },
      { slug: "complex", name: "Komplex", nameEn: "Complex", serviceSlug: "webapps", visualCount: 8, order: 3 }
    ],
    automation: [
      { slug: "basic_automation", name: "Basis", nameEn: "Basic", serviceSlug: "automation", visualCount: 2, order: 1 },
      { slug: "advanced_automation", name: "Erweitert", nameEn: "Advanced", serviceSlug: "automation", visualCount: 4, order: 2 },
      { slug: "full_automation", name: "Komplett", nameEn: "Complete", serviceSlug: "automation", visualCount: 6, order: 3 }
    ]
  };
  var addons = {
    webdesign: [
      {
        slug: "blog",
        name: "Blog",
        nameEn: "Blog",
        serviceSlug: "webdesign",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F4DD}",
        order: 1,
        suggestionText: "Die meisten Kunden f\xFCgen auch einen Blog hinzu",
        suggestionTextEn: "Most clients also add a blog",
        isRecommended: true
      },
      {
        slug: "multilang",
        name: "Mehrsprachigkeit",
        nameEn: "Multilingual",
        serviceSlug: "webdesign",
        requiresAddon: null,
        visualType: "badge",
        icon: "\u{1F30D}",
        order: 2,
        suggestionText: "Erreichen Sie internationale Kunden mit Mehrsprachigkeit",
        suggestionTextEn: "Reach international customers with multilingual support",
        isRecommended: true
      },
      {
        slug: "cms",
        name: "CMS Integration",
        nameEn: "CMS Integration",
        serviceSlug: "webdesign",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F4CB}",
        order: 3,
        suggestionText: "Verwalten Sie Inhalte selbst mit CMS Integration",
        suggestionTextEn: "Manage content yourself with CMS integration",
        isRecommended: false
      },
      {
        slug: "seo",
        name: "SEO Optimierung",
        nameEn: "SEO Optimization",
        serviceSlug: "webdesign",
        requiresAddon: null,
        visualType: "badge",
        icon: "\u{1F50D}",
        order: 4,
        suggestionText: "Verbessern Sie Ihre Sichtbarkeit mit SEO",
        suggestionTextEn: "Improve your visibility with SEO",
        isRecommended: true
      },
      {
        slug: "analytics",
        name: "Analytics Setup",
        nameEn: "Analytics Setup",
        serviceSlug: "webdesign",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F4CA}",
        order: 5,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      }
    ],
    social_media: [
      {
        slug: "content_creation",
        name: "Content-Erstellung",
        nameEn: "Content Creation",
        serviceSlug: "social_media",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F3A8}",
        order: 1,
        suggestionText: "Professioneller Content erh\xF6ht Engagement um 300%",
        suggestionTextEn: "Professional content increases engagement by 300%",
        isRecommended: true
      },
      {
        slug: "community_management",
        name: "Community Management",
        nameEn: "Community Management",
        serviceSlug: "social_media",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F4AC}",
        order: 2,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      },
      {
        slug: "paid_ads",
        name: "Bezahlte Werbung",
        nameEn: "Paid Advertising",
        serviceSlug: "social_media",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F4B0}",
        order: 3,
        suggestionText: "Maximieren Sie Reichweite mit bezahlter Werbung",
        suggestionTextEn: "Maximize reach with paid advertising",
        isRecommended: true
      },
      {
        slug: "influencer",
        name: "Influencer Marketing",
        nameEn: "Influencer Marketing",
        serviceSlug: "social_media",
        requiresAddon: "paid_ads",
        visualType: "card",
        icon: "\u2B50",
        order: 4,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      }
    ],
    recruiting: [
      {
        slug: "job_ads",
        name: "Stellenanzeigen",
        nameEn: "Job Postings",
        serviceSlug: "recruiting",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F4E2}",
        order: 1,
        suggestionText: "Optimierte Stellenanzeigen f\xFCr mehr Bewerbungen",
        suggestionTextEn: "Optimized job postings for more applications",
        isRecommended: true
      },
      {
        slug: "employer_branding",
        name: "Employer Branding",
        nameEn: "Employer Branding",
        serviceSlug: "recruiting",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F3E2}",
        order: 2,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      },
      {
        slug: "social_recruiting",
        name: "Social Recruiting",
        nameEn: "Social Recruiting",
        serviceSlug: "recruiting",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F517}",
        order: 3,
        suggestionText: "Finden Sie Talente \xFCber Social Media",
        suggestionTextEn: "Find talents through social media",
        isRecommended: true
      }
    ],
    webapps: [
      {
        slug: "user_auth",
        name: "Benutzer-Login",
        nameEn: "User Authentication",
        serviceSlug: "webapps",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F510}",
        order: 1,
        suggestionText: "Sichere Benutzer-Authentifizierung",
        suggestionTextEn: "Secure user authentication",
        isRecommended: true
      },
      {
        slug: "database",
        name: "Datenbank",
        nameEn: "Database",
        serviceSlug: "webapps",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F5C4}\uFE0F",
        order: 2,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      },
      {
        slug: "api_integration",
        name: "API Integration",
        nameEn: "API Integration",
        serviceSlug: "webapps",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F50C}",
        order: 3,
        suggestionText: "Verbinden Sie externe Dienste",
        suggestionTextEn: "Connect external services",
        isRecommended: true
      },
      {
        slug: "realtime",
        name: "Echtzeit-Funktionen",
        nameEn: "Realtime Features",
        serviceSlug: "webapps",
        requiresAddon: "database",
        visualType: "badge",
        icon: "\u26A1",
        order: 4,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      }
    ],
    automation: [
      {
        slug: "crm_integration",
        name: "CRM Integration",
        nameEn: "CRM Integration",
        serviceSlug: "automation",
        requiresAddon: null,
        visualType: "section",
        icon: "\u{1F4C7}",
        order: 1,
        suggestionText: "Integrieren Sie Ihr CRM f\xFCr nahtlose Lead-Verwaltung",
        suggestionTextEn: "Integrate your CRM for seamless lead management",
        isRecommended: true
      },
      {
        slug: "email_automation",
        name: "E-Mail Automation",
        nameEn: "Email Automation",
        serviceSlug: "automation",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F4E7}",
        order: 2,
        suggestionText: "Automatisierte E-Mail-Sequenzen",
        suggestionTextEn: "Automated email sequences",
        isRecommended: true
      },
      {
        slug: "lead_scoring",
        name: "Lead Scoring",
        nameEn: "Lead Scoring",
        serviceSlug: "automation",
        requiresAddon: "crm_integration",
        visualType: "badge",
        icon: "\u{1F3AF}",
        order: 3,
        suggestionText: null,
        suggestionTextEn: null,
        isRecommended: false
      },
      {
        slug: "chatbot",
        name: "Chatbot",
        nameEn: "Chatbot",
        serviceSlug: "automation",
        requiresAddon: null,
        visualType: "card",
        icon: "\u{1F916}",
        order: 4,
        suggestionText: "Automatisieren Sie Kundenanfragen mit einem Chatbot",
        suggestionTextEn: "Automate customer inquiries with a chatbot",
        isRecommended: false
      }
    ]
  };
  function getConfigData() {
    return {
      services: [...services].sort((a, b) => a.order - b.order),
      sizes: { ...sizes },
      addons: { ...addons }
    };
  }

  // src/state/store.js
  function createInitialState(defaultLang = "de") {
    return {
      lang: defaultLang,
      selections: {},
      // Record<serviceSlug, ServiceSelection>
      lastInteractionTime: Date.now(),
      isSubmitting: false,
      submitStatus: "idle",
      // 'idle' | 'success' | 'error'
      validationErrors: [],
      // Array of { serviceSlug, field, message }
      suggestionVisible: false,
      currentSuggestion: null
    };
  }
  function createStore(reducer, initialState) {
    let state = initialState;
    const listeners = /* @__PURE__ */ new Set();
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
        if (state !== prevState) {
          listeners.forEach((listener) => listener(state, prevState, action));
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
        listeners.forEach((listener) => listener(state, prevState, { type: "REPLACE_STATE" }));
      }
    };
  }

  // src/state/reducer.js
  var ActionTypes = {
    TOGGLE_SERVICE: "TOGGLE_SERVICE",
    SET_SIZE: "SET_SIZE",
    TOGGLE_ADDON: "TOGGLE_ADDON",
    REMOVE_SERVICE: "REMOVE_SERVICE",
    REMOVE_ADDON: "REMOVE_ADDON",
    SET_LANG: "SET_LANG",
    RECORD_INTERACTION: "RECORD_INTERACTION",
    SET_SUBMITTING: "SET_SUBMITTING",
    SET_SUBMIT_STATUS: "SET_SUBMIT_STATUS",
    SET_VALIDATION_ERRORS: "SET_VALIDATION_ERRORS",
    CLEAR_VALIDATION_ERRORS: "CLEAR_VALIDATION_ERRORS",
    SHOW_SUGGESTION: "SHOW_SUGGESTION",
    HIDE_SUGGESTION: "HIDE_SUGGESTION",
    RESET: "RESET"
  };
  var actions = {
    toggleService: (serviceSlug) => ({
      type: ActionTypes.TOGGLE_SERVICE,
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
  function findDependentAddons(addonSlug, addonConfig) {
    const toRemove = /* @__PURE__ */ new Set([addonSlug]);
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
  function canAddAddon(selection, addon) {
    if (!addon.requiresAddon)
      return true;
    return selection.addons.has(addon.requiresAddon);
  }
  function createReducer(configData, initialState) {
    return function reducer(state, action) {
      switch (action.type) {
        case ActionTypes.TOGGLE_SERVICE: {
          const { serviceSlug } = action.payload;
          const isSelected = serviceSlug in state.selections;
          if (isSelected) {
            const newSelections = { ...state.selections };
            delete newSelections[serviceSlug];
            return {
              ...state,
              selections: newSelections
            };
          } else {
            return {
              ...state,
              selections: {
                ...state.selections,
                [serviceSlug]: {
                  serviceSlug,
                  size: null,
                  addons: /* @__PURE__ */ new Set()
                }
              }
            };
          }
        }
        case ActionTypes.SET_SIZE: {
          const { serviceSlug, sizeSlug } = action.payload;
          const selection = state.selections[serviceSlug];
          if (!selection)
            return state;
          if (selection.size === sizeSlug) {
            return {
              ...state,
              selections: {
                ...state.selections,
                [serviceSlug]: {
                  ...selection,
                  size: null,
                  addons: /* @__PURE__ */ new Set()
                  // Clear addons when size is removed
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
          if (!selection || !selection.size)
            return state;
          const addonConfig = configData.addons[serviceSlug] || [];
          const addon = addonConfig.find((a) => a.slug === addonSlug);
          if (!addon)
            return state;
          const newAddons = new Set(selection.addons);
          if (newAddons.has(addonSlug)) {
            const toRemove = findDependentAddons(addonSlug, addonConfig);
            toRemove.forEach((slug) => newAddons.delete(slug));
          } else {
            if (canAddAddon(selection, addon)) {
              newAddons.add(addonSlug);
            } else {
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
          if (!selection)
            return state;
          const addonConfig = configData.addons[serviceSlug] || [];
          const toRemove = findDependentAddons(addonSlug, addonConfig);
          const newAddons = new Set(
            [...selection.addons].filter((a) => !toRemove.has(a))
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
            suggestionVisible: false
            // Hide suggestion on interaction
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

  // src/utils/i18n.js
  var translations = {
    de: {
      // Headers
      "title": "Service Konfigurator",
      "subtitle": "Stellen Sie Ihr individuelles Angebot zusammen",
      // Sections
      "services.title": "W\xE4hlen Sie Ihre Services",
      "services.subtitle": "Klicken Sie auf die gew\xFCnschten Services",
      "size.title": "W\xE4hlen Sie die Gr\xF6\xDFe",
      "addons.title": "Zus\xE4tzliche Optionen",
      "summary.title": "Ihre Auswahl",
      "summary.empty": "Noch keine Services ausgew\xE4hlt",
      // Buttons
      "submit": "Angebot anfordern",
      "submitting": "Wird gesendet...",
      "reset": "Zur\xFCcksetzen",
      "remove": "Entfernen",
      // Status messages
      "success.title": "Vielen Dank!",
      "success.message": "Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in K\xFCrze bei Ihnen.",
      "error.title": "Fehler",
      "error.message": "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      "error.retry": "Erneut versuchen",
      // Validation
      "validation.selectService": "Bitte w\xE4hlen Sie mindestens einen Service aus",
      "validation.selectSize": "Bitte w\xE4hlen Sie eine Gr\xF6\xDFe f\xFCr",
      // Language toggle
      "lang.de": "DE",
      "lang.en": "EN",
      "lang.switch": "Sprache wechseln",
      // Suggestion
      "suggestion.prefix": "Tipp: ",
      "suggestion.dismiss": "Verstanden",
      // Accessibility
      "a11y.removeService": "Service entfernen",
      "a11y.removeAddon": "Add-on entfernen",
      "a11y.selectSize": "Gr\xF6\xDFe ausw\xE4hlen",
      "a11y.toggleAddon": "Add-on ausw\xE4hlen oder abw\xE4hlen"
    },
    en: {
      // Headers
      "title": "Service Configurator",
      "subtitle": "Build your custom offer",
      // Sections
      "services.title": "Select Your Services",
      "services.subtitle": "Click on the desired services",
      "size.title": "Select Size",
      "addons.title": "Additional Options",
      "summary.title": "Your Selection",
      "summary.empty": "No services selected yet",
      // Buttons
      "submit": "Request Offer",
      "submitting": "Sending...",
      "reset": "Reset",
      "remove": "Remove",
      // Status messages
      "success.title": "Thank You!",
      "success.message": "Your request has been sent successfully. We will contact you shortly.",
      "error.title": "Error",
      "error.message": "An error occurred. Please try again.",
      "error.retry": "Try Again",
      // Validation
      "validation.selectService": "Please select at least one service",
      "validation.selectSize": "Please select a size for",
      // Language toggle
      "lang.de": "DE",
      "lang.en": "EN",
      "lang.switch": "Switch language",
      // Suggestion
      "suggestion.prefix": "Tip: ",
      "suggestion.dismiss": "Got it",
      // Accessibility
      "a11y.removeService": "Remove service",
      "a11y.removeAddon": "Remove add-on",
      "a11y.selectSize": "Select size",
      "a11y.toggleAddon": "Select or deselect add-on"
    }
  };
  function t(key, lang = "de") {
    const langTranslations = translations[lang] || translations.de;
    return langTranslations[key] || translations.de[key] || key;
  }
  function getLocalizedName(item, lang) {
    if (!item)
      return "";
    return lang === "en" ? item.nameEn || item.name : item.name;
  }
  function detectBrowserLanguage(defaultLang = "de") {
    try {
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        const langCode = browserLang.split("-")[0].toLowerCase();
        if (langCode === "de" || langCode === "en") {
          return langCode;
        }
      }
    } catch (e) {
      console.warn("Language detection failed:", e);
    }
    return defaultLang;
  }
  function updateAllTranslations(root, lang) {
    const elements = root.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = t(key, lang);
      const attrTarget = el.getAttribute("data-i18n-attr");
      if (attrTarget) {
        el.setAttribute(attrTarget, translation);
      } else {
        el.textContent = translation;
      }
    });
  }

  // src/state/selectors.js
  function getSelectedServices(state) {
    return Object.keys(state.selections);
  }
  function isServiceSelected(state, serviceSlug) {
    return serviceSlug in state.selections;
  }
  function getValidationErrors(state, configData) {
    const errors = [];
    const services2 = getSelectedServices(state);
    if (services2.length === 0) {
      errors.push({
        serviceSlug: null,
        field: "services",
        message: state.lang === "de" ? "Bitte w\xE4hlen Sie mindestens einen Service aus" : "Please select at least one service"
      });
      return errors;
    }
    for (const serviceSlug of services2) {
      const selection = state.selections[serviceSlug];
      const service = configData.services.find((s) => s.slug === serviceSlug);
      const serviceName = service ? state.lang === "de" ? service.name : service.nameEn : serviceSlug;
      if (!selection.size) {
        errors.push({
          serviceSlug,
          field: "size",
          message: state.lang === "de" ? `Bitte w\xE4hlen Sie eine Gr\xF6\xDFe f\xFCr ${serviceName}` : `Please select a size for ${serviceName}`
        });
      }
    }
    return errors;
  }
  function getSelectionSummary(state, configData) {
    const summary = [];
    for (const [serviceSlug, selection] of Object.entries(state.selections)) {
      const service = configData.services.find((s) => s.slug === serviceSlug);
      if (!service)
        continue;
      const serviceName = state.lang === "de" ? service.name : service.nameEn;
      summary.push({
        type: "service",
        serviceSlug,
        slug: serviceSlug,
        name: serviceName,
        removeTarget: `service:${serviceSlug}`
      });
      if (selection.size) {
        const sizes2 = configData.sizes[serviceSlug] || [];
        const size = sizes2.find((s) => s.slug === selection.size);
        if (size) {
          const sizeName = state.lang === "de" ? size.name : size.nameEn;
          summary.push({
            type: "size",
            serviceSlug,
            slug: selection.size,
            name: `${serviceName}: ${sizeName}`,
            removeTarget: null
            // Sizes can't be removed individually from summary
          });
        }
      }
      const addonConfig = configData.addons[serviceSlug] || [];
      for (const addonSlug of selection.addons) {
        const addon = addonConfig.find((a) => a.slug === addonSlug);
        if (addon) {
          const addonName = state.lang === "de" ? addon.name : addon.nameEn;
          summary.push({
            type: "addon",
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
  function getSuggestion(state, configData) {
    const services2 = getSelectedServices(state);
    if (services2.length === 0)
      return null;
    for (const serviceSlug of services2) {
      const selection = state.selections[serviceSlug];
      if (!selection.size)
        continue;
      const addonConfig = configData.addons[serviceSlug] || [];
      for (const addon of addonConfig) {
        if (addon.isRecommended && !selection.addons.has(addon.slug) && addon.suggestionText) {
          if (addon.requiresAddon && !selection.addons.has(addon.requiresAddon)) {
            continue;
          }
          return {
            serviceSlug,
            addonSlug: addon.slug,
            text: state.lang === "de" ? addon.suggestionText : addon.suggestionTextEn,
            addonName: state.lang === "de" ? addon.name : addon.nameEn
          };
        }
      }
    }
    return null;
  }

  // src/utils/helpers.js
  function generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }
  function parseRemoveTarget(target) {
    const parts = target.split(":");
    if (parts[0] === "service") {
      return {
        type: "service",
        serviceSlug: parts[1]
      };
    }
    if (parts[0] === "addon") {
      return {
        type: "addon",
        serviceSlug: parts[1],
        addonSlug: parts[2]
      };
    }
    return null;
  }
  function getOrCreateSessionId() {
    const key = "tl-configurator-session";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = generateUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  }
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function serializeSelections(selections) {
    const result = {};
    for (const [key, value] of Object.entries(selections)) {
      result[key] = {
        ...value,
        addons: [...value.addons]
      };
    }
    return result;
  }

  // src/render/templates.js
  var templateCache = /* @__PURE__ */ new Map();
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
  function createFallbackTemplates() {
    const container = document.createElement("div");
    container.style.display = "none";
    container.innerHTML = `
    <!-- Service Card Template -->
    <template data-template="service-card">
      <button class="tl-service-card" data-service="" data-action="toggle-service">
        <span class="tl-service-icon" data-service-icon></span>
        <span class="tl-service-name" data-service-name></span>
        <span class="tl-service-check">\u2713</span>
      </button>
    </template>
    
    <!-- Service Build Area Template -->
    <template data-template="service-build">
      <div class="tl-service-build" data-service-build="">
        <div class="tl-build-header">
          <span class="tl-build-title" data-build-title></span>
          <button class="tl-build-remove" data-action="remove" data-target="" aria-label="Remove">\xD7</button>
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
        <span class="tl-addon-check">\u2713</span>
      </button>
    </template>
    
    <!-- Summary Chip Template -->
    <template data-template="summary-chip">
      <div class="tl-summary-chip" data-chip="">
        <span class="tl-chip-text" data-chip-text></span>
        <button class="tl-chip-remove" data-action="remove" data-target="" aria-label="Remove">\xD7</button>
      </div>
    </template>
    
    <!-- Suggestion Toast Template -->
    <template data-template="suggestion">
      <div class="tl-suggestion-toast">
        <span class="tl-suggestion-icon">\u{1F4A1}</span>
        <span class="tl-suggestion-text" data-suggestion-text></span>
        <button class="tl-suggestion-dismiss" data-action="dismiss-suggestion">\xD7</button>
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
    templateCache.clear();
  }
  function cloneTemplate(templateName) {
    const selector = `[data-template="${templateName}"]`;
    const template = getTemplate(selector);
    if (!template) {
      console.warn(`Template not found: ${templateName}`);
      return null;
    }
    return template.content.cloneNode(true);
  }
  function createServiceCard(service, lang, isSelected = false) {
    const fragment = cloneTemplate("service-card");
    if (!fragment)
      return null;
    const card = fragment.querySelector("[data-service]") || fragment.firstElementChild;
    const name = lang === "en" ? service.nameEn : service.name;
    card.setAttribute("data-service", service.slug);
    card.querySelector("[data-service-icon]").textContent = service.icon || "\u{1F4E6}";
    card.querySelector("[data-service-name]").textContent = name;
    if (isSelected) {
      card.classList.add("is-selected");
    }
    return card;
  }
  function createServiceBuild(service, lang) {
    const fragment = cloneTemplate("service-build");
    if (!fragment)
      return null;
    const build = fragment.querySelector("[data-service-build]") || fragment.firstElementChild;
    const name = lang === "en" ? service.nameEn : service.name;
    build.setAttribute("data-service-build", service.slug);
    build.querySelector("[data-build-title]").textContent = name;
    const removeBtn = build.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.setAttribute("data-target", `service:${service.slug}`);
    }
    return build;
  }
  function createSizeButton(size, serviceSlug, lang, isSelected = false) {
    const fragment = cloneTemplate("size-btn");
    if (!fragment)
      return null;
    const btn = fragment.querySelector("[data-size]") || fragment.firstElementChild;
    const name = lang === "en" ? size.nameEn : size.name;
    btn.setAttribute("data-size", size.slug);
    btn.setAttribute("data-for-service", serviceSlug);
    btn.querySelector("[data-size-name]").textContent = name;
    if (isSelected) {
      btn.classList.add("is-selected");
    }
    return btn;
  }
  function createPageCards(count, lang) {
    const fragment = document.createDocumentFragment();
    const maxVisible = Math.min(count, 10);
    for (let i = 1; i <= maxVisible; i++) {
      const cardFragment = cloneTemplate("page-card");
      if (cardFragment) {
        const card = cardFragment.querySelector(".tl-page-card") || cardFragment.firstElementChild;
        card.querySelector("[data-page-number]").textContent = i;
        card.style.setProperty("--animation-delay", `${(i - 1) * 50}ms`);
        fragment.appendChild(card);
      }
    }
    if (count > maxVisible) {
      const more = document.createElement("div");
      more.className = "tl-page-card tl-page-more";
      more.textContent = `+${count - maxVisible}`;
      fragment.appendChild(more);
    }
    return fragment;
  }
  function createModuleCards(count, lang) {
    const fragment = document.createDocumentFragment();
    const moduleNames = lang === "en" ? ["Module", "Component", "Feature", "System", "Integration", "Platform"] : ["Modul", "Komponente", "Feature", "System", "Integration", "Plattform"];
    for (let i = 0; i < count; i++) {
      const cardFragment = cloneTemplate("module-card");
      if (cardFragment) {
        const card = cardFragment.querySelector(".tl-module-card") || cardFragment.firstElementChild;
        const iconEl = card.querySelector("[data-module-icon]");
        const nameEl = card.querySelector("[data-module-name]");
        if (iconEl)
          iconEl.textContent = ["\u2699\uFE0F", "\u{1F527}", "\u{1F4CA}", "\u{1F50C}", "\u{1F3AF}", "\u{1F4C8}"][i % 6];
        if (nameEl)
          nameEl.textContent = moduleNames[i % moduleNames.length];
        card.style.setProperty("--animation-delay", `${i * 50}ms`);
        fragment.appendChild(card);
      }
    }
    return fragment;
  }
  function createAddonButton(addon, serviceSlug, lang, isSelected = false, isDisabled = false) {
    const fragment = cloneTemplate("addon-btn");
    if (!fragment)
      return null;
    const btn = fragment.querySelector("[data-addon]") || fragment.firstElementChild;
    const name = lang === "en" ? addon.nameEn : addon.name;
    btn.setAttribute("data-addon", addon.slug);
    btn.setAttribute("data-for-service", serviceSlug);
    btn.querySelector("[data-addon-icon]").textContent = addon.icon || "\u2795";
    btn.querySelector("[data-addon-name]").textContent = name;
    if (isSelected) {
      btn.classList.add("is-selected");
    }
    if (isDisabled) {
      btn.classList.add("is-disabled");
      btn.setAttribute("disabled", "disabled");
      btn.setAttribute("title", lang === "en" ? "Requires another add-on first" : "Ben\xF6tigt erst ein anderes Add-on");
    }
    return btn;
  }
  function createAddonVisual(addon, lang) {
    const name = lang === "en" ? addon.nameEn : addon.name;
    switch (addon.visualType) {
      case "section": {
        const fragment = cloneTemplate("addon-section");
        if (!fragment)
          return null;
        const section = fragment.querySelector("[data-addon-section]") || fragment.firstElementChild;
        section.setAttribute("data-addon-section", addon.slug);
        const iconEl = section.querySelector("[data-section-icon]");
        const nameEl = section.querySelector("[data-section-name]");
        if (iconEl)
          iconEl.textContent = addon.icon || "\u{1F4CB}";
        if (nameEl)
          nameEl.textContent = name;
        return section;
      }
      case "badge": {
        const fragment = cloneTemplate("addon-badge");
        if (!fragment)
          return null;
        const badge = fragment.querySelector("[data-addon-badge]") || fragment.firstElementChild;
        badge.setAttribute("data-addon-badge", addon.slug);
        const textEl = badge.querySelector("[data-badge-text]");
        if (textEl)
          textEl.textContent = name;
        return badge;
      }
      case "card":
      default: {
        const fragment = cloneTemplate("addon-visual-card");
        if (!fragment)
          return null;
        const card = fragment.querySelector("[data-addon-visual]") || fragment.firstElementChild;
        card.setAttribute("data-addon-visual", addon.slug);
        const iconEl = card.querySelector("[data-addon-visual-icon]");
        const nameEl = card.querySelector("[data-addon-visual-name]");
        if (iconEl)
          iconEl.textContent = addon.icon || "\u{1F4E6}";
        if (nameEl)
          nameEl.textContent = name;
        return card;
      }
    }
  }
  function createSummaryChip(item) {
    const fragment = cloneTemplate("summary-chip");
    if (!fragment)
      return null;
    const chip = fragment.querySelector("[data-chip]") || fragment.firstElementChild;
    chip.setAttribute("data-chip", `${item.type}:${item.serviceSlug}:${item.slug}`);
    chip.classList.add(`tl-chip-${item.type}`);
    chip.querySelector("[data-chip-text]").textContent = item.name;
    const removeBtn = chip.querySelector('[data-action="remove"]');
    if (removeBtn) {
      if (item.removeTarget) {
        removeBtn.setAttribute("data-target", item.removeTarget);
      } else {
        removeBtn.style.display = "none";
      }
    }
    return chip;
  }
  function createSuggestionToast(suggestion) {
    const fragment = cloneTemplate("suggestion");
    if (!fragment)
      return null;
    const toast = fragment.querySelector(".tl-suggestion-toast") || fragment.firstElementChild;
    const textEl = toast.querySelector("[data-suggestion-text]");
    if (textEl) {
      textEl.textContent = suggestion.text;
    }
    toast.setAttribute("data-suggestion-service", suggestion.serviceSlug);
    toast.setAttribute("data-suggestion-addon", suggestion.addonSlug);
    return toast;
  }

  // src/render/animations.js
  var AnimationClasses = {
    POP_ENTER: "tl-anim-pop-enter",
    POP_EXIT: "tl-anim-pop-exit",
    FADE_ENTER: "tl-anim-fade-enter",
    FADE_EXIT: "tl-anim-fade-exit",
    SLIDE_DOWN_ENTER: "tl-anim-slide-down-enter",
    SLIDE_UP_EXIT: "tl-anim-slide-up-exit",
    STAGGER: "tl-anim-stagger",
    SHAKE: "tl-anim-shake"
  };
  var Durations = {
    POP: 300,
    FADE: 200,
    SLIDE: 250,
    STAGGER_DELAY: 50,
    SHAKE: 400
  };
  function shouldReduceMotion() {
    return prefersReducedMotion();
  }
  function animateEnter(element, type = "pop", delay = 0) {
    if (shouldReduceMotion()) {
      element.style.opacity = "1";
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const className = {
        pop: AnimationClasses.POP_ENTER,
        fade: AnimationClasses.FADE_ENTER,
        slide: AnimationClasses.SLIDE_DOWN_ENTER
      }[type] || AnimationClasses.POP_ENTER;
      const duration = {
        pop: Durations.POP,
        fade: Durations.FADE,
        slide: Durations.SLIDE
      }[type] || Durations.POP;
      if (delay > 0) {
        element.style.animationDelay = `${delay}ms`;
      }
      element.classList.add(className);
      const onEnd = () => {
        element.classList.remove(className);
        element.style.animationDelay = "";
        resolve();
      };
      element.addEventListener("animationend", onEnd, { once: true });
      setTimeout(onEnd, duration + delay + 50);
    });
  }
  function animateExit(element, type = "pop", removeAfter = true) {
    if (shouldReduceMotion()) {
      if (removeAfter) {
        element.remove();
      } else {
        element.style.opacity = "0";
      }
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const className = {
        pop: AnimationClasses.POP_EXIT,
        fade: AnimationClasses.FADE_EXIT,
        slide: AnimationClasses.SLIDE_UP_EXIT
      }[type] || AnimationClasses.POP_EXIT;
      const duration = {
        pop: Durations.POP,
        fade: Durations.FADE,
        slide: Durations.SLIDE
      }[type] || Durations.POP;
      element.classList.add(className);
      const onEnd = () => {
        if (removeAfter) {
          element.remove();
        } else {
          element.classList.remove(className);
        }
        resolve();
      };
      element.addEventListener("animationend", onEnd, { once: true });
      setTimeout(onEnd, duration + 50);
    });
  }
  function animateStaggered(elements, type = "pop", staggerDelay = Durations.STAGGER_DELAY) {
    if (shouldReduceMotion()) {
      elements.forEach((el) => el.style.opacity = "1");
      return Promise.resolve();
    }
    const promises = elements.map((element, index) => {
      return animateEnter(element, type, index * staggerDelay);
    });
    return Promise.all(promises);
  }
  function animateShake(element) {
    if (shouldReduceMotion()) {
      element.style.transition = "background-color 0.1s";
      element.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      setTimeout(() => {
        element.style.backgroundColor = "";
      }, 200);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      element.classList.add(AnimationClasses.SHAKE);
      const onEnd = () => {
        element.classList.remove(AnimationClasses.SHAKE);
        resolve();
      };
      element.addEventListener("animationend", onEnd, { once: true });
      setTimeout(onEnd, Durations.SHAKE + 50);
    });
  }
  async function animateExpand(element) {
    if (shouldReduceMotion()) {
      element.style.height = "auto";
      element.style.overflow = "";
      return;
    }
    element.style.height = "auto";
    element.style.overflow = "hidden";
    const naturalHeight = element.offsetHeight;
    element.style.height = "0";
    await nextFrame();
    element.style.transition = "height 0.3s ease-out";
    element.style.height = `${naturalHeight}px`;
    return new Promise((resolve) => {
      const onEnd = () => {
        element.style.height = "auto";
        element.style.overflow = "";
        element.style.transition = "";
        resolve();
      };
      element.addEventListener("transitionend", onEnd, { once: true });
      setTimeout(onEnd, 350);
    });
  }
  async function animateCollapse(element, removeAfter = true) {
    if (shouldReduceMotion()) {
      if (removeAfter) {
        element.remove();
      } else {
        element.style.height = "0";
        element.style.overflow = "hidden";
      }
      return;
    }
    const currentHeight = element.offsetHeight;
    element.style.height = `${currentHeight}px`;
    element.style.overflow = "hidden";
    await nextFrame();
    element.style.transition = "height 0.25s ease-in, opacity 0.2s ease-in";
    element.style.height = "0";
    element.style.opacity = "0";
    return new Promise((resolve) => {
      const onEnd = () => {
        if (removeAfter) {
          element.remove();
        }
        resolve();
      };
      element.addEventListener("transitionend", onEnd, { once: true });
      setTimeout(onEnd, 300);
    });
  }
  function injectAnimationStyles() {
    const styleId = "tl-configurator-animations";
    if (document.getElementById(styleId))
      return;
    const css = `
    /* Pop Enter */
    @keyframes tlPopIn {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    /* Pop Exit */
    @keyframes tlPopOut {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    
    /* Fade Enter */
    @keyframes tlFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Fade Exit */
    @keyframes tlFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    /* Slide Down Enter */
    @keyframes tlSlideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Slide Up Exit */
    @keyframes tlSlideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    
    /* Shake */
    @keyframes tlShake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    
    /* Animation Classes */
    .${AnimationClasses.POP_ENTER} {
      animation: tlPopIn ${Durations.POP}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    .${AnimationClasses.POP_EXIT} {
      animation: tlPopOut ${Durations.POP * 0.66}ms ease-out forwards;
    }
    
    .${AnimationClasses.FADE_ENTER} {
      animation: tlFadeIn ${Durations.FADE}ms ease-out forwards;
    }
    
    .${AnimationClasses.FADE_EXIT} {
      animation: tlFadeOut ${Durations.FADE}ms ease-in forwards;
    }
    
    .${AnimationClasses.SLIDE_DOWN_ENTER} {
      animation: tlSlideDown ${Durations.SLIDE}ms ease-out forwards;
    }
    
    .${AnimationClasses.SLIDE_UP_EXIT} {
      animation: tlSlideUp ${Durations.SLIDE}ms ease-in forwards;
    }
    
    .${AnimationClasses.SHAKE} {
      animation: tlShake ${Durations.SHAKE}ms ease-in-out;
    }
    
    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .${AnimationClasses.POP_ENTER},
      .${AnimationClasses.POP_EXIT},
      .${AnimationClasses.FADE_ENTER},
      .${AnimationClasses.FADE_EXIT},
      .${AnimationClasses.SLIDE_DOWN_ENTER},
      .${AnimationClasses.SLIDE_UP_EXIT},
      .${AnimationClasses.SHAKE} {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // src/render/renderer.js
  function createRenderer(rootElement, store, configData) {
    let elements = {};
    function init2() {
      injectAnimationStyles();
      createFallbackTemplates();
      buildInitialStructure();
      cacheElements();
      render(store.getState(), null);
    }
    function buildInitialStructure() {
      const state = store.getState();
      rootElement.innerHTML = `
      <div class="tl-configurator">
        <!-- Language Toggle -->
        <div class="tl-lang-toggle" data-lang-toggle>
          <button class="tl-lang-btn ${state.lang === "de" ? "is-active" : ""}" 
                  data-action="set-lang" data-lang="de">DE</button>
          <button class="tl-lang-btn ${state.lang === "en" ? "is-active" : ""}" 
                  data-action="set-lang" data-lang="en">EN</button>
        </div>
        
        <!-- Header -->
        <header class="tl-header">
          <h1 class="tl-title" data-i18n="title">${t("title", state.lang)}</h1>
          <p class="tl-subtitle" data-i18n="subtitle">${t("subtitle", state.lang)}</p>
        </header>
        
        <!-- Services Grid -->
        <section class="tl-section tl-services-section">
          <h2 class="tl-section-title" data-i18n="services.title">${t("services.title", state.lang)}</h2>
          <div class="tl-services-grid" data-services-grid></div>
        </section>
        
        <!-- Build Area -->
        <section class="tl-section tl-build-section">
          <div class="tl-build-area" data-build-area></div>
        </section>
        
        <!-- Summary -->
        <aside class="tl-summary-panel" data-summary>
          <h3 class="tl-summary-title" data-i18n="summary.title">${t("summary.title", state.lang)}</h3>
          <div class="tl-summary-items" data-summary-items>
            <p class="tl-summary-empty" data-i18n="summary.empty">${t("summary.empty", state.lang)}</p>
          </div>
        </aside>
        
        <!-- Suggestion Container -->
        <div class="tl-suggestion-container" data-suggestion-container></div>
        
        <!-- Submit Section -->
        <section class="tl-submit-section" data-submit-section>
          <div class="tl-validation-errors" data-validation-errors></div>
          <button class="tl-submit-btn" data-submit-btn data-action="submit">
            <span data-i18n="submit">${t("submit", state.lang)}</span>
          </button>
          <div class="tl-submit-status" data-submit-status></div>
        </section>
      </div>
    `;
    }
    function cacheElements() {
      elements = {
        servicesGrid: rootElement.querySelector("[data-services-grid]"),
        buildArea: rootElement.querySelector("[data-build-area]"),
        summary: rootElement.querySelector("[data-summary]"),
        summaryItems: rootElement.querySelector("[data-summary-items]"),
        submitBtn: rootElement.querySelector("[data-submit-btn]"),
        submitStatus: rootElement.querySelector("[data-submit-status]"),
        validationErrors: rootElement.querySelector("[data-validation-errors]"),
        suggestionContainer: rootElement.querySelector("[data-suggestion-container]"),
        langToggle: rootElement.querySelector("[data-lang-toggle]")
      };
    }
    function render(newState, prevState, action = {}) {
      if (!prevState) {
        renderServicesGrid(newState);
        renderSummary(newState);
        return;
      }
      if (newState.lang !== prevState.lang) {
        updateAllTranslations(rootElement, newState.lang);
        renderServicesGrid(newState);
        renderAllBuilds(newState);
        renderSummary(newState);
        updateLangToggle(newState.lang);
        return;
      }
      if (newState.selections !== prevState.selections) {
        updateServicesGrid(newState, prevState);
        updateBuilds(newState, prevState, action);
        renderSummary(newState);
      }
      if (newState.isSubmitting !== prevState.isSubmitting || newState.submitStatus !== prevState.submitStatus) {
        updateSubmitUI(newState);
      }
      if (newState.validationErrors !== prevState.validationErrors) {
        renderValidationErrors(newState);
      }
      if (newState.suggestionVisible !== prevState.suggestionVisible || newState.currentSuggestion !== prevState.currentSuggestion) {
        updateSuggestion(newState);
      }
    }
    function renderServicesGrid(state) {
      const fragment = document.createDocumentFragment();
      for (const service of configData.services) {
        const isSelected = isServiceSelected(state, service.slug);
        const card = createServiceCard(service, state.lang, isSelected);
        if (card)
          fragment.appendChild(card);
      }
      elements.servicesGrid.innerHTML = "";
      elements.servicesGrid.appendChild(fragment);
      const cards = elements.servicesGrid.querySelectorAll(".tl-service-card");
      animateStaggered([...cards], "fade", 30);
    }
    function updateServicesGrid(newState, prevState) {
      const cards = elements.servicesGrid.querySelectorAll("[data-service]");
      cards.forEach((card) => {
        const slug = card.getAttribute("data-service");
        const wasSelected = isServiceSelected(prevState, slug);
        const isSelected = isServiceSelected(newState, slug);
        if (wasSelected !== isSelected) {
          card.classList.toggle("is-selected", isSelected);
        }
      });
    }
    function renderAllBuilds(state) {
      elements.buildArea.innerHTML = "";
      const selectedServices = getSelectedServices(state);
      for (const serviceSlug of selectedServices) {
        const service = configData.services.find((s) => s.slug === serviceSlug);
        if (service) {
          const buildEl = createServiceBuildElement(service, state);
          elements.buildArea.appendChild(buildEl);
        }
      }
    }
    function updateBuilds(newState, prevState, action) {
      const prevServices = new Set(getSelectedServices(prevState));
      const newServices = new Set(getSelectedServices(newState));
      const added = [...newServices].filter((s) => !prevServices.has(s));
      const removed = [...prevServices].filter((s) => !newServices.has(s));
      for (const serviceSlug of removed) {
        const buildEl = elements.buildArea.querySelector(`[data-service-build="${serviceSlug}"]`);
        if (buildEl) {
          animateCollapse(buildEl, true);
        }
      }
      for (const serviceSlug of added) {
        const service = configData.services.find((s) => s.slug === serviceSlug);
        if (service) {
          const buildEl = createServiceBuildElement(service, newState);
          elements.buildArea.appendChild(buildEl);
          animateExpand(buildEl);
        }
      }
      for (const serviceSlug of newServices) {
        if (prevServices.has(serviceSlug)) {
          const prevSelection = prevState.selections[serviceSlug];
          const newSelection = newState.selections[serviceSlug];
          if (prevSelection.size !== newSelection.size) {
            updateBuildSize(serviceSlug, newState, prevState);
          }
          if (prevSelection.addons !== newSelection.addons) {
            updateBuildAddons(serviceSlug, newState, prevState);
          }
        }
      }
    }
    function createServiceBuildElement(service, state) {
      const selection = state.selections[service.slug];
      const buildEl = createServiceBuild(service, state.lang);
      const sizeSelector = buildEl.querySelector("[data-size-selector]");
      const sizes2 = configData.sizes[service.slug] || [];
      for (const size of sizes2) {
        const isSelected = selection && selection.size === size.slug;
        const btn = createSizeButton(size, service.slug, state.lang, isSelected);
        if (btn)
          sizeSelector.appendChild(btn);
      }
      const visualContainer = buildEl.querySelector("[data-visual-container]");
      if (selection && selection.size) {
        const size = sizes2.find((s) => s.slug === selection.size);
        if (size) {
          renderVisuals(visualContainer, service, size, selection, state.lang);
        }
      }
      const addonsContainer = buildEl.querySelector("[data-addons-container]");
      if (selection && selection.size) {
        renderAddonButtons(addonsContainer, service.slug, selection, state);
      }
      return buildEl;
    }
    function updateBuildSize(serviceSlug, newState, prevState) {
      const buildEl = elements.buildArea.querySelector(`[data-service-build="${serviceSlug}"]`);
      if (!buildEl)
        return;
      const selection = newState.selections[serviceSlug];
      const service = configData.services.find((s) => s.slug === serviceSlug);
      const sizes2 = configData.sizes[serviceSlug] || [];
      const sizeButtons = buildEl.querySelectorAll("[data-size]");
      sizeButtons.forEach((btn) => {
        const isSelected = btn.getAttribute("data-size") === selection.size;
        btn.classList.toggle("is-selected", isSelected);
      });
      const visualContainer = buildEl.querySelector("[data-visual-container]");
      visualContainer.innerHTML = "";
      if (selection.size) {
        const size = sizes2.find((s) => s.slug === selection.size);
        if (size) {
          renderVisuals(visualContainer, service, size, selection, newState.lang);
        }
      }
      const addonsContainer = buildEl.querySelector("[data-addons-container]");
      addonsContainer.innerHTML = "";
      if (selection.size) {
        renderAddonButtons(addonsContainer, serviceSlug, selection, newState);
      }
    }
    function updateBuildAddons(serviceSlug, newState, prevState) {
      const buildEl = elements.buildArea.querySelector(`[data-service-build="${serviceSlug}"]`);
      if (!buildEl)
        return;
      const selection = newState.selections[serviceSlug];
      const prevSelection = prevState.selections[serviceSlug];
      const addons2 = configData.addons[serviceSlug] || [];
      const addonButtons = buildEl.querySelectorAll("[data-addon]");
      addonButtons.forEach((btn) => {
        const addonSlug = btn.getAttribute("data-addon");
        const isSelected = selection.addons.has(addonSlug);
        const addon = addons2.find((a) => a.slug === addonSlug);
        const isDisabled = addon && addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
        btn.classList.toggle("is-selected", isSelected);
        btn.classList.toggle("is-disabled", isDisabled);
        btn.disabled = isDisabled;
      });
      const visualContainer = buildEl.querySelector("[data-visual-container]");
      const prevAddons = prevSelection ? prevSelection.addons : /* @__PURE__ */ new Set();
      const added = [...selection.addons].filter((a) => !prevAddons.has(a));
      const removed = [...prevAddons].filter((a) => !selection.addons.has(a));
      for (const addonSlug of removed) {
        const visual = visualContainer.querySelector(`[data-addon-visual="${addonSlug}"], [data-addon-section="${addonSlug}"], [data-addon-badge="${addonSlug}"]`);
        if (visual) {
          animateExit(visual, "pop", true);
        }
      }
      for (const addonSlug of added) {
        const addon = addons2.find((a) => a.slug === addonSlug);
        if (addon) {
          const visual = createAddonVisual(addon, newState.lang);
          if (visual) {
            visualContainer.appendChild(visual);
            animateEnter(visual, "pop");
          }
        }
      }
    }
    function renderVisuals(container, service, size, selection, lang) {
      let visualElements;
      switch (service.visualType) {
        case "pages":
          visualElements = createPageCards(size.visualCount, lang);
          break;
        case "modules":
        case "cards":
        default:
          visualElements = createModuleCards(size.visualCount, lang);
          break;
      }
      container.appendChild(visualElements);
      const addons2 = configData.addons[service.slug] || [];
      for (const addonSlug of selection.addons) {
        const addon = addons2.find((a) => a.slug === addonSlug);
        if (addon) {
          const visual = createAddonVisual(addon, lang);
          if (visual)
            container.appendChild(visual);
        }
      }
      const allVisuals = container.children;
      animateStaggered([...allVisuals], "pop", 50);
    }
    function renderAddonButtons(container, serviceSlug, selection, state) {
      const addons2 = configData.addons[serviceSlug] || [];
      if (addons2.length === 0) {
        container.style.display = "none";
        return;
      }
      container.style.display = "";
      const header = document.createElement("h4");
      header.className = "tl-addons-title";
      header.setAttribute("data-i18n", "addons.title");
      header.textContent = t("addons.title", state.lang);
      container.appendChild(header);
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "tl-addons-buttons";
      for (const addon of addons2) {
        const isSelected = selection.addons.has(addon.slug);
        const isDisabled = addon.requiresAddon && !selection.addons.has(addon.requiresAddon);
        const btn = createAddonButton(addon, serviceSlug, state.lang, isSelected, isDisabled);
        if (btn)
          buttonsContainer.appendChild(btn);
      }
      container.appendChild(buttonsContainer);
    }
    function renderSummary(state) {
      const items = getSelectionSummary(state, configData);
      if (items.length === 0) {
        elements.summaryItems.innerHTML = `
        <p class="tl-summary-empty" data-i18n="summary.empty">${t("summary.empty", state.lang)}</p>
      `;
        return;
      }
      const fragment = document.createDocumentFragment();
      for (const item of items) {
        const chip = createSummaryChip(item);
        if (chip)
          fragment.appendChild(chip);
      }
      elements.summaryItems.innerHTML = "";
      elements.summaryItems.appendChild(fragment);
    }
    function updateSubmitUI(state) {
      const btn = elements.submitBtn;
      const status = elements.submitStatus;
      btn.disabled = state.isSubmitting;
      btn.classList.toggle("is-loading", state.isSubmitting);
      const btnText = btn.querySelector("[data-i18n]");
      if (btnText) {
        btnText.textContent = state.isSubmitting ? t("submitting", state.lang) : t("submit", state.lang);
      }
      switch (state.submitStatus) {
        case "success":
          status.innerHTML = `
          <div class="tl-status-success">
            <h4>${t("success.title", state.lang)}</h4>
            <p>${t("success.message", state.lang)}</p>
          </div>
        `;
          status.style.display = "block";
          animateEnter(status, "fade");
          break;
        case "error":
          status.innerHTML = `
          <div class="tl-status-error">
            <h4>${t("error.title", state.lang)}</h4>
            <p>${t("error.message", state.lang)}</p>
            <button class="tl-retry-btn" data-action="retry">${t("error.retry", state.lang)}</button>
          </div>
        `;
          status.style.display = "block";
          animateEnter(status, "fade");
          break;
        default:
          status.style.display = "none";
          status.innerHTML = "";
      }
    }
    function renderValidationErrors(state) {
      const container = elements.validationErrors;
      if (state.validationErrors.length === 0) {
        container.innerHTML = "";
        container.style.display = "none";
        return;
      }
      container.innerHTML = state.validationErrors.map((err) => `<p class="tl-validation-error">${err.message}</p>`).join("");
      container.style.display = "block";
      animateShake(container);
      for (const error of state.validationErrors) {
        if (error.serviceSlug) {
          const buildEl = elements.buildArea.querySelector(`[data-service-build="${error.serviceSlug}"]`);
          if (buildEl) {
            buildEl.classList.add("has-error");
            animateShake(buildEl);
          }
        }
      }
    }
    function updateSuggestion(state) {
      const container = elements.suggestionContainer;
      if (!state.suggestionVisible || !state.currentSuggestion) {
        const existing = container.querySelector(".tl-suggestion-toast");
        if (existing) {
          animateExit(existing, "slide", true);
        }
        return;
      }
      container.innerHTML = "";
      const toast = createSuggestionToast(state.currentSuggestion);
      if (toast) {
        container.appendChild(toast);
        animateEnter(toast, "slide");
      }
    }
    function updateLangToggle(lang) {
      const buttons = elements.langToggle.querySelectorAll("[data-lang]");
      buttons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
      });
    }
    function getRoot() {
      return rootElement;
    }
    function getElements() {
      return elements;
    }
    return {
      init: init2,
      render,
      getRoot,
      getElements
    };
  }

  // src/events/handlers.js
  function createEventHandlers(rootElement, store, configData, onSubmit) {
    let inactivityTimer = null;
    let suggestionTimer = null;
    function init2() {
      rootElement.addEventListener("click", handleClick);
      rootElement.addEventListener("keydown", handleKeydown);
      startInactivityTimer();
      rootElement.addEventListener("mousemove", debounce(recordInteraction, 1e3), { passive: true });
      rootElement.addEventListener("touchstart", recordInteraction, { passive: true });
    }
    function handleClick(event) {
      recordInteraction();
      const actionElement = event.target.closest("[data-action]");
      if (!actionElement)
        return;
      const action = actionElement.dataset.action;
      if (actionElement.tagName === "BUTTON") {
        event.preventDefault();
      }
      switch (action) {
        case "toggle-service":
          handleToggleService(actionElement);
          break;
        case "set-size":
          handleSetSize(actionElement);
          break;
        case "toggle-addon":
          handleToggleAddon(actionElement);
          break;
        case "remove":
          handleRemove(actionElement);
          break;
        case "submit":
          handleSubmit();
          break;
        case "set-lang":
          handleSetLang(actionElement);
          break;
        case "dismiss-suggestion":
          handleDismissSuggestion();
          break;
        case "retry":
          handleRetry();
          break;
      }
    }
    function handleKeydown(event) {
      if (event.key === "Enter" || event.key === " ") {
        const target = event.target;
        if (target.matches("[data-action]") && target.tagName !== "BUTTON") {
          event.preventDefault();
          handleClick({ target, preventDefault: () => {
          } });
        }
      }
      if (event.key === "Escape") {
        const state = store.getState();
        if (state.suggestionVisible) {
          store.dispatch(actions.hideSuggestion());
        }
      }
    }
    function handleToggleService(element) {
      const serviceSlug = element.dataset.service;
      if (!serviceSlug)
        return;
      store.dispatch(actions.toggleService(serviceSlug));
      store.dispatch(actions.clearValidationErrors());
    }
    function handleSetSize(element) {
      const sizeSlug = element.dataset.size;
      const serviceSlug = element.dataset.forService;
      if (!sizeSlug || !serviceSlug)
        return;
      const state = store.getState();
      if (!isServiceSelected(state, serviceSlug))
        return;
      store.dispatch(actions.setSize(serviceSlug, sizeSlug));
      store.dispatch(actions.clearValidationErrors());
    }
    function handleToggleAddon(element) {
      const addonSlug = element.dataset.addon;
      const serviceSlug = element.dataset.forService;
      if (!addonSlug || !serviceSlug)
        return;
      if (element.classList.contains("is-disabled") || element.disabled)
        return;
      store.dispatch(actions.toggleAddon(serviceSlug, addonSlug));
    }
    function handleRemove(element) {
      const target = element.dataset.target;
      if (!target)
        return;
      const parsed = parseRemoveTarget(target);
      if (!parsed)
        return;
      if (parsed.type === "service") {
        store.dispatch(actions.removeService(parsed.serviceSlug));
      } else if (parsed.type === "addon") {
        store.dispatch(actions.removeAddon(parsed.serviceSlug, parsed.addonSlug));
      }
      store.dispatch(actions.clearValidationErrors());
    }
    async function handleSubmit() {
      const state = store.getState();
      if (state.isSubmitting)
        return;
      const errors = getValidationErrors(state, configData);
      if (errors.length > 0) {
        store.dispatch(actions.setValidationErrors(errors));
        return;
      }
      store.dispatch(actions.clearValidationErrors());
      if (onSubmit) {
        await onSubmit(state);
      }
    }
    function handleSetLang(element) {
      const lang = element.dataset.lang;
      if (!lang || lang !== "de" && lang !== "en")
        return;
      store.dispatch(actions.setLang(lang));
    }
    function handleDismissSuggestion() {
      store.dispatch(actions.hideSuggestion());
    }
    function handleRetry() {
      store.dispatch(actions.setSubmitStatus("idle"));
      handleSubmit();
    }
    function recordInteraction() {
      store.dispatch(actions.recordInteraction());
      store.dispatch(actions.hideSuggestion());
      resetInactivityTimer();
    }
    function startInactivityTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        checkAndShowSuggestion();
      }, CONFIG.inactivityTimeout);
    }
    function resetInactivityTimer() {
      clearTimeout(inactivityTimer);
      clearTimeout(suggestionTimer);
      startInactivityTimer();
    }
    function checkAndShowSuggestion() {
      const state = store.getState();
      if (state.isSubmitting || state.suggestionVisible)
        return;
      if (getSelectedServices(state).length === 0)
        return;
      const suggestion = getSuggestion(state, configData);
      if (suggestion) {
        store.dispatch(actions.showSuggestion(suggestion));
        suggestionTimer = setTimeout(() => {
          store.dispatch(actions.hideSuggestion());
        }, CONFIG.suggestionDuration);
      }
    }
    function destroy() {
      rootElement.removeEventListener("click", handleClick);
      rootElement.removeEventListener("keydown", handleKeydown);
      clearTimeout(inactivityTimer);
      clearTimeout(suggestionTimer);
    }
    return {
      init: init2,
      destroy,
      recordInteraction,
      resetInactivityTimer
    };
  }

  // src/submission/submit.js
  function buildPayload(state, configData) {
    const lang = state.lang;
    const sessionId = getOrCreateSessionId();
    const services2 = Object.values(state.selections).filter((sel) => sel.size).map((sel) => {
      const service = configData.services.find((s) => s.slug === sel.serviceSlug);
      const sizes2 = configData.sizes[sel.serviceSlug] || [];
      const size = sizes2.find((s) => s.slug === sel.size);
      const addonConfig = configData.addons[sel.serviceSlug] || [];
      const serviceName = service ? getLocalizedName(service, lang) : sel.serviceSlug;
      const sizeName = size ? getLocalizedName(size, lang) : sel.size;
      const addons2 = [...sel.addons].map((addonSlug) => {
        const addon = addonConfig.find((a) => a.slug === addonSlug);
        return {
          id: addonSlug,
          name: addon ? getLocalizedName(addon, lang) : addonSlug
        };
      });
      const parts = [sizeName, ...addons2.map((a) => a.name)];
      const summary = `${serviceName}: ${parts.join(" + ")}`;
      return {
        id: sel.serviceSlug,
        name: serviceName,
        size: {
          id: sel.size,
          name: sizeName
        },
        addons: addons2,
        summary
      };
    });
    const humanSummary = services2.map((s) => {
      const addonText = s.addons.length > 0 ? ` (${s.size.name} + ${s.addons.map((a) => a.name).join(" + ")})` : ` (${s.size.name})`;
      return s.name + addonText;
    }).join(", ");
    return {
      meta: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        sourceUrl: window.location.href,
        lang,
        userAgent: navigator.userAgent,
        sessionId
      },
      services: services2,
      humanSummary,
      rawConfig: JSON.stringify(serializeSelections(state.selections))
    };
  }
  function validatePayload(payload) {
    const errors = [];
    if (!payload.services || payload.services.length === 0) {
      errors.push("No services selected");
    }
    for (const service of payload.services || []) {
      if (!service.id) {
        errors.push("Service missing ID");
      }
      if (!service.size || !service.size.id) {
        errors.push(`Service ${service.id} missing size`);
      }
    }
    if (!payload.meta || !payload.meta.sessionId) {
      errors.push("Missing session ID");
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
  async function submitToWebhook(payload, webhookUrl, options = {}) {
    const { retries = 2, retryDelay = 1e3 } = options;
    const lastSubmissionKey = "tl-configurator-last-submission";
    const lastSubmission = localStorage.getItem(lastSubmissionKey);
    if (lastSubmission === payload.meta.sessionId) {
      console.warn("Duplicate submission prevented");
      return { success: false, error: "duplicate", isDuplicate: true };
    }
    const validation = validatePayload(payload);
    if (!validation.valid) {
      console.error("Invalid payload:", validation.errors);
      return { success: false, error: validation.errors.join(", ") };
    }
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        localStorage.setItem(lastSubmissionKey, payload.meta.sessionId);
        let responseData = null;
        try {
          const text = await response.text();
          if (text) {
            responseData = JSON.parse(text);
          }
        } catch (e) {
        }
        return { success: true, data: responseData };
      } catch (error) {
        lastError = error;
        console.warn(`Submission attempt ${attempt + 1} failed:`, error.message);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    return { success: false, error: lastError?.message || "Unknown error" };
  }
  function createSubmitHandler(store, configData, webhookUrl) {
    return async function handleSubmit(state) {
      store.dispatch(actions.setSubmitting(true));
      store.dispatch(actions.setSubmitStatus("idle"));
      try {
        const payload = buildPayload(state, configData);
        console.log("Submitting payload:", payload);
        const result = await submitToWebhook(payload, webhookUrl);
        if (result.success) {
          store.dispatch(actions.setSubmitStatus("success"));
          if (typeof gtag === "function") {
            gtag("event", "form_submit", {
              event_category: "configurator",
              event_label: "success",
              value: payload.services.length
            });
          }
        } else if (result.isDuplicate) {
          store.dispatch(actions.setSubmitStatus("success"));
        } else {
          store.dispatch(actions.setSubmitStatus("error"));
          console.error("Submission failed:", result.error);
        }
      } catch (error) {
        console.error("Submission error:", error);
        store.dispatch(actions.setSubmitStatus("error"));
      } finally {
        store.dispatch(actions.setSubmitting(false));
      }
    };
  }

  // src/index.js
  function init(options = {}) {
    const config = {
      webhookUrl: options.webhookUrl || CONFIG.webhookUrl,
      inactivityTimeout: options.inactivityTimeout || CONFIG.inactivityTimeout,
      defaultLang: options.defaultLang || CONFIG.defaultLang,
      rootSelector: options.rootSelector || CONFIG.selectors.root,
      autoDetectLang: options.autoDetectLang !== false
    };
    CONFIG.webhookUrl = config.webhookUrl;
    CONFIG.inactivityTimeout = config.inactivityTimeout;
    const rootElement = document.querySelector(config.rootSelector);
    if (!rootElement) {
      console.error(`TL Configurator: Root element not found (${config.rootSelector})`);
      return null;
    }
    const configData = getConfigData();
    let initialLang = config.defaultLang;
    if (config.autoDetectLang) {
      initialLang = detectBrowserLanguage(config.defaultLang);
    }
    const initialState = createInitialState(initialLang);
    const reducer = createReducer(configData, initialState);
    const store = createStore(reducer, initialState);
    const submitHandler = createSubmitHandler(store, configData, config.webhookUrl);
    const renderer = createRenderer(rootElement, store, configData);
    const eventHandlers = createEventHandlers(rootElement, store, configData, submitHandler);
    store.subscribe((newState, prevState, action) => {
      renderer.render(newState, prevState, action);
    });
    renderer.init();
    eventHandlers.init();
    if (typeof performance !== "undefined") {
      performance.mark("tl-configurator-ready");
    }
    console.log("TL Configurator initialized", {
      lang: initialLang,
      services: configData.services.length
    });
    return {
      /**
       * Get current state
       */
      getState: () => store.getState(),
      /**
       * Get configuration data
       */
      getConfigData: () => configData,
      /**
       * Set language
       */
      setLang: (lang) => {
        if (lang === "de" || lang === "en") {
          store.dispatch({ type: "SET_LANG", payload: { lang } });
        }
      },
      /**
       * Reset the configurator
       */
      reset: () => {
        store.dispatch({ type: "RESET" });
      },
      /**
       * Destroy the configurator
       */
      destroy: () => {
        eventHandlers.destroy();
        rootElement.innerHTML = "";
      },
      /**
       * Manually trigger submission
       */
      submit: () => submitHandler(store.getState())
    };
  }
  if (typeof window !== "undefined") {
    window.TLConfigurator = { init };
  }
  var src_default = { init };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=configurator.js.map
