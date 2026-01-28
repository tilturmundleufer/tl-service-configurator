/**
 * CMS Data - Represents the Webflow CMS Collections
 * 
 * In production, this data would come from:
 * 1. Webflow CMS API fetch
 * 2. Embedded JSON from Webflow Collection List
 * 3. Static export during build
 * 
 * WEBFLOW CMS SETUP INSTRUCTIONS:
 * ================================
 * 
 * Collection 1: "Services"
 * Fields:
 *   - name (Plain Text) - German display name
 *   - name_en (Plain Text) - English display name
 *   - slug (Slug) - Unique identifier
 *   - icon (Image) - Service icon SVG/PNG
 *   - description (Rich Text) - German description
 *   - description_en (Rich Text) - English description
 *   - order (Number) - Sort order
 *   - visual_type (Option: pages/modules/cards) - Visual representation type
 * 
 * Collection 2: "Sizes"
 * Fields:
 *   - name (Plain Text) - German display name
 *   - name_en (Plain Text) - English display name
 *   - slug (Slug) - Unique identifier
 *   - service (Reference -> Services) - Parent service
 *   - visual_count (Number) - Number of visual elements to show
 *   - order (Number) - Sort order
 * 
 * Collection 3: "Addons"
 * Fields:
 *   - name (Plain Text) - German display name
 *   - name_en (Plain Text) - English display name
 *   - slug (Slug) - Unique identifier
 *   - service (Reference -> Services) - Parent service
 *   - requires_addon (Reference -> Addons, optional) - Dependency
 *   - visual_type (Option: card/badge/section) - UI representation
 *   - icon (Image) - Addon icon
 *   - order (Number) - Sort order
 *   - suggestion_text (Plain Text) - Text for inactivity suggestion DE
 *   - suggestion_text_en (Plain Text) - Text for inactivity suggestion EN
 *   - is_recommended (Switch) - Whether to suggest this addon
 */

export const services = [
  {
    slug: 'webdesign',
    name: 'Webdesign',
    nameEn: 'Web Design',
    icon: '🌐',
    description: 'Professionelle Websites mit modernem Design',
    descriptionEn: 'Professional websites with modern design',
    visualType: 'pages',
    order: 1
  },
  {
    slug: 'social_media',
    name: 'Social Media Marketing',
    nameEn: 'Social Media Marketing',
    icon: '📱',
    description: 'Strategische Social Media Präsenz',
    descriptionEn: 'Strategic social media presence',
    visualType: 'modules',
    order: 2
  },
  {
    slug: 'recruiting',
    name: 'Mitarbeitergewinnung',
    nameEn: 'Recruiting',
    icon: '👥',
    description: 'Effektive Personalgewinnung',
    descriptionEn: 'Effective talent acquisition',
    visualType: 'cards',
    order: 3
  },
  {
    slug: 'webapps',
    name: 'Webanwendungen',
    nameEn: 'Web Applications',
    icon: '⚡',
    description: 'Maßgeschneiderte Web-Apps',
    descriptionEn: 'Custom web applications',
    visualType: 'modules',
    order: 4
  },
  {
    slug: 'automation',
    name: 'Lead/Automatisierung',
    nameEn: 'Lead/Automation',
    icon: '🤖',
    description: 'Automatisierte Lead-Systeme',
    descriptionEn: 'Automated lead systems',
    visualType: 'modules',
    order: 5
  }
];

export const sizes = {
  webdesign: [
    { slug: '3_pages', name: '3 Seiten', nameEn: '3 Pages', serviceSlug: 'webdesign', visualCount: 3, order: 1 },
    { slug: '5_pages', name: '5 Seiten', nameEn: '5 Pages', serviceSlug: 'webdesign', visualCount: 5, order: 2 },
    { slug: '10_pages', name: '10 Seiten', nameEn: '10 Pages', serviceSlug: 'webdesign', visualCount: 10, order: 3 },
    { slug: 'custom_pages', name: 'Individuell', nameEn: 'Custom', serviceSlug: 'webdesign', visualCount: 1, order: 4 }
  ],
  social_media: [
    { slug: 'starter', name: 'Starter', nameEn: 'Starter', serviceSlug: 'social_media', visualCount: 2, order: 1 },
    { slug: 'professional', name: 'Professional', nameEn: 'Professional', serviceSlug: 'social_media', visualCount: 4, order: 2 },
    { slug: 'enterprise', name: 'Enterprise', nameEn: 'Enterprise', serviceSlug: 'social_media', visualCount: 6, order: 3 }
  ],
  recruiting: [
    { slug: 'single_position', name: '1 Stelle', nameEn: '1 Position', serviceSlug: 'recruiting', visualCount: 1, order: 1 },
    { slug: 'multi_position', name: '3-5 Stellen', nameEn: '3-5 Positions', serviceSlug: 'recruiting', visualCount: 4, order: 2 },
    { slug: 'campaign', name: 'Kampagne', nameEn: 'Campaign', serviceSlug: 'recruiting', visualCount: 6, order: 3 }
  ],
  webapps: [
    { slug: 'mvp', name: 'MVP', nameEn: 'MVP', serviceSlug: 'webapps', visualCount: 3, order: 1 },
    { slug: 'standard', name: 'Standard', nameEn: 'Standard', serviceSlug: 'webapps', visualCount: 5, order: 2 },
    { slug: 'complex', name: 'Komplex', nameEn: 'Complex', serviceSlug: 'webapps', visualCount: 8, order: 3 }
  ],
  automation: [
    { slug: 'basic_automation', name: 'Basis', nameEn: 'Basic', serviceSlug: 'automation', visualCount: 2, order: 1 },
    { slug: 'advanced_automation', name: 'Erweitert', nameEn: 'Advanced', serviceSlug: 'automation', visualCount: 4, order: 2 },
    { slug: 'full_automation', name: 'Komplett', nameEn: 'Complete', serviceSlug: 'automation', visualCount: 6, order: 3 }
  ]
};

export const addons = {
  webdesign: [
    {
      slug: 'blog',
      name: 'Blog',
      nameEn: 'Blog',
      serviceSlug: 'webdesign',
      requiresAddon: null,
      visualType: 'section',
      icon: '📝',
      order: 1,
      suggestionText: 'Die meisten Kunden fügen auch einen Blog hinzu',
      suggestionTextEn: 'Most clients also add a blog',
      isRecommended: true
    },
    {
      slug: 'multilang',
      name: 'Mehrsprachigkeit',
      nameEn: 'Multilingual',
      serviceSlug: 'webdesign',
      requiresAddon: null,
      visualType: 'badge',
      icon: '🌍',
      order: 2,
      suggestionText: 'Erreichen Sie internationale Kunden mit Mehrsprachigkeit',
      suggestionTextEn: 'Reach international customers with multilingual support',
      isRecommended: true
    },
    {
      slug: 'cms',
      name: 'CMS Integration',
      nameEn: 'CMS Integration',
      serviceSlug: 'webdesign',
      requiresAddon: null,
      visualType: 'card',
      icon: '📋',
      order: 3,
      suggestionText: 'Verwalten Sie Inhalte selbst mit CMS Integration',
      suggestionTextEn: 'Manage content yourself with CMS integration',
      isRecommended: false
    },
    {
      slug: 'seo',
      name: 'SEO Optimierung',
      nameEn: 'SEO Optimization',
      serviceSlug: 'webdesign',
      requiresAddon: null,
      visualType: 'badge',
      icon: '🔍',
      order: 4,
      suggestionText: 'Verbessern Sie Ihre Sichtbarkeit mit SEO',
      suggestionTextEn: 'Improve your visibility with SEO',
      isRecommended: true
    },
    {
      slug: 'analytics',
      name: 'Analytics Setup',
      nameEn: 'Analytics Setup',
      serviceSlug: 'webdesign',
      requiresAddon: null,
      visualType: 'card',
      icon: '📊',
      order: 5,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    }
  ],
  social_media: [
    {
      slug: 'content_creation',
      name: 'Content-Erstellung',
      nameEn: 'Content Creation',
      serviceSlug: 'social_media',
      requiresAddon: null,
      visualType: 'section',
      icon: '🎨',
      order: 1,
      suggestionText: 'Professioneller Content erhöht Engagement um 300%',
      suggestionTextEn: 'Professional content increases engagement by 300%',
      isRecommended: true
    },
    {
      slug: 'community_management',
      name: 'Community Management',
      nameEn: 'Community Management',
      serviceSlug: 'social_media',
      requiresAddon: null,
      visualType: 'card',
      icon: '💬',
      order: 2,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    },
    {
      slug: 'paid_ads',
      name: 'Bezahlte Werbung',
      nameEn: 'Paid Advertising',
      serviceSlug: 'social_media',
      requiresAddon: null,
      visualType: 'section',
      icon: '💰',
      order: 3,
      suggestionText: 'Maximieren Sie Reichweite mit bezahlter Werbung',
      suggestionTextEn: 'Maximize reach with paid advertising',
      isRecommended: true
    },
    {
      slug: 'influencer',
      name: 'Influencer Marketing',
      nameEn: 'Influencer Marketing',
      serviceSlug: 'social_media',
      requiresAddon: 'paid_ads',
      visualType: 'card',
      icon: '⭐',
      order: 4,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    }
  ],
  recruiting: [
    {
      slug: 'job_ads',
      name: 'Stellenanzeigen',
      nameEn: 'Job Postings',
      serviceSlug: 'recruiting',
      requiresAddon: null,
      visualType: 'section',
      icon: '📢',
      order: 1,
      suggestionText: 'Optimierte Stellenanzeigen für mehr Bewerbungen',
      suggestionTextEn: 'Optimized job postings for more applications',
      isRecommended: true
    },
    {
      slug: 'employer_branding',
      name: 'Employer Branding',
      nameEn: 'Employer Branding',
      serviceSlug: 'recruiting',
      requiresAddon: null,
      visualType: 'card',
      icon: '🏢',
      order: 2,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    },
    {
      slug: 'social_recruiting',
      name: 'Social Recruiting',
      nameEn: 'Social Recruiting',
      serviceSlug: 'recruiting',
      requiresAddon: null,
      visualType: 'section',
      icon: '🔗',
      order: 3,
      suggestionText: 'Finden Sie Talente über Social Media',
      suggestionTextEn: 'Find talents through social media',
      isRecommended: true
    }
  ],
  webapps: [
    {
      slug: 'user_auth',
      name: 'Benutzer-Login',
      nameEn: 'User Authentication',
      serviceSlug: 'webapps',
      requiresAddon: null,
      visualType: 'card',
      icon: '🔐',
      order: 1,
      suggestionText: 'Sichere Benutzer-Authentifizierung',
      suggestionTextEn: 'Secure user authentication',
      isRecommended: true
    },
    {
      slug: 'database',
      name: 'Datenbank',
      nameEn: 'Database',
      serviceSlug: 'webapps',
      requiresAddon: null,
      visualType: 'section',
      icon: '🗄️',
      order: 2,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    },
    {
      slug: 'api_integration',
      name: 'API Integration',
      nameEn: 'API Integration',
      serviceSlug: 'webapps',
      requiresAddon: null,
      visualType: 'card',
      icon: '🔌',
      order: 3,
      suggestionText: 'Verbinden Sie externe Dienste',
      suggestionTextEn: 'Connect external services',
      isRecommended: true
    },
    {
      slug: 'realtime',
      name: 'Echtzeit-Funktionen',
      nameEn: 'Realtime Features',
      serviceSlug: 'webapps',
      requiresAddon: 'database',
      visualType: 'badge',
      icon: '⚡',
      order: 4,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    }
  ],
  automation: [
    {
      slug: 'crm_integration',
      name: 'CRM Integration',
      nameEn: 'CRM Integration',
      serviceSlug: 'automation',
      requiresAddon: null,
      visualType: 'section',
      icon: '📇',
      order: 1,
      suggestionText: 'Integrieren Sie Ihr CRM für nahtlose Lead-Verwaltung',
      suggestionTextEn: 'Integrate your CRM for seamless lead management',
      isRecommended: true
    },
    {
      slug: 'email_automation',
      name: 'E-Mail Automation',
      nameEn: 'Email Automation',
      serviceSlug: 'automation',
      requiresAddon: null,
      visualType: 'card',
      icon: '📧',
      order: 2,
      suggestionText: 'Automatisierte E-Mail-Sequenzen',
      suggestionTextEn: 'Automated email sequences',
      isRecommended: true
    },
    {
      slug: 'lead_scoring',
      name: 'Lead Scoring',
      nameEn: 'Lead Scoring',
      serviceSlug: 'automation',
      requiresAddon: 'crm_integration',
      visualType: 'badge',
      icon: '🎯',
      order: 3,
      suggestionText: null,
      suggestionTextEn: null,
      isRecommended: false
    },
    {
      slug: 'chatbot',
      name: 'Chatbot',
      nameEn: 'Chatbot',
      serviceSlug: 'automation',
      requiresAddon: null,
      visualType: 'card',
      icon: '🤖',
      order: 4,
      suggestionText: 'Automatisieren Sie Kundenanfragen mit einem Chatbot',
      suggestionTextEn: 'Automate customer inquiries with a chatbot',
      isRecommended: false
    }
  ]
};

/**
 * Get all configuration data as a single object
 */
export function getConfigData() {
  return {
    services: [...services].sort((a, b) => a.order - b.order),
    sizes: { ...sizes },
    addons: { ...addons }
  };
}

export default { services, sizes, addons, getConfigData };
