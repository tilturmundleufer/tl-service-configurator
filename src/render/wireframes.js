/**
 * Wireframe Components - Image-based visual representations for each service
 */

// Hosted image URLs for addon visualizations
const ADDON_IMAGES = {
  blog: 'https://cdn.prod.website-files.com/67f7b904ecb4d95ff83be511/6981ec0b3beecf8f7550a724_Blog%20section.avif',
  cms: 'https://cdn.prod.website-files.com/67f7b904ecb4d95ff83be511/6981ec0bd7bf0c826d38e4a4_CMS%20Integration.avif',
  analytics: 'https://cdn.prod.website-files.com/67f7b904ecb4d95ff83be511/6981ec0bda00668ba15b2dc2_Analytical%20Setup.avif',
  multilang: 'https://cdn.prod.website-files.com/67f7b904ecb4d95ff83be511/6981ec0b8982d50c157a3fa5_Multilingual%20.avif',
  seo: 'https://cdn.prod.website-files.com/67f7b904ecb4d95ff83be511/6981ec0b892814492a9c2a8b_SEO%20Optimisation.avif',
  initialPage: 'https://cdn.prod.website-files.com/67f7b904ecb4d95ff83be511/6981ec0ba953d32a7697882f_initial%20page%20selection.avif'
};

/**
 * Create the base wireframe SVG for a webpage
 * @param {number} pageNumber - Page number to display (used for stacking)
 * @param {number} totalPages - Total number of pages selected
 * @param {boolean} hasBlog - Whether blog addon is selected
 * @returns {string} SVG markup
 */
export function createPageWireframeSVG(pageNumber = 1, totalPages = 1, hasBlog = false) {
  // Only show blog section on the front page (page 1)
  const blogSection = (pageNumber === 1 && hasBlog) ? `
    <!-- Blog Section -->
    <rect x="12" y="200" width="176" height="1" fill="#22C55E"/>
    <text x="100" y="215" text-anchor="middle" fill="#22C55E" font-size="8" font-weight="600">BLOG</text>
    <rect x="12" y="222" width="52" height="35" rx="2" fill="#DCFCE7" stroke="#22C55E" stroke-width="1"/>
    <rect x="70" y="222" width="52" height="35" rx="2" fill="#DCFCE7" stroke="#22C55E" stroke-width="1"/>
    <rect x="128" y="222" width="52" height="35" rx="2" fill="#DCFCE7" stroke="#22C55E" stroke-width="1"/>
    <rect x="16" y="226" width="44" height="20" rx="1" fill="#BBF7D0"/>
    <rect x="16" y="250" width="35" height="4" rx="1" fill="#86EFAC"/>
    <rect x="74" y="226" width="44" height="20" rx="1" fill="#BBF7D0"/>
    <rect x="74" y="250" width="35" height="4" rx="1" fill="#86EFAC"/>
    <rect x="132" y="226" width="44" height="20" rx="1" fill="#BBF7D0"/>
    <rect x="132" y="250" width="35" height="4" rx="1" fill="#86EFAC"/>
  ` : `
    <!-- Content section 2 -->
    <rect x="12" y="210" width="88" height="8" rx="2" fill="#CBD5E1"/>
    <rect x="12" y="224" width="80" height="6" rx="2" fill="#E2E8F0"/>
    <rect x="12" y="236" width="70" height="6" rx="2" fill="#E2E8F0"/>
    <rect x="108" y="210" width="80" height="50" rx="4" fill="#F1F5F9"/>
  `;

  return `
    <svg class="tl-wireframe-svg" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Page background -->
      <rect x="1" y="1" width="198" height="278" rx="8" fill="white" stroke="#E2E8F0" stroke-width="2"/>
      
      <!-- Header bar -->
      <rect x="12" y="12" width="176" height="24" rx="4" fill="#F1F5F9"/>
      <circle cx="24" cy="24" r="6" fill="#CBD5E1"/>
      <rect x="36" y="20" width="40" height="8" rx="2" fill="#CBD5E1"/>
      
      <!-- Navigation dots -->
      <circle cx="150" cy="24" r="3" fill="#CBD5E1"/>
      <circle cx="162" cy="24" r="3" fill="#CBD5E1"/>
      <circle cx="174" cy="24" r="3" fill="#CBD5E1"/>
      
      <!-- Hero section -->
      <rect x="12" y="48" width="80" height="12" rx="2" fill="#94A3B8"/>
      <rect x="12" y="66" width="100" height="8" rx="2" fill="#CBD5E1"/>
      <rect x="12" y="80" width="90" height="8" rx="2" fill="#CBD5E1"/>
      <rect x="12" y="94" width="60" height="20" rx="4" fill="#3B82F6"/>
      
      <!-- Hero image placeholder -->
      <rect x="120" y="48" width="68" height="66" rx="4" fill="#E2E8F0"/>
      <path d="M144 75 L154 65 L164 80 L174 70 L174 100 L144 100 Z" fill="#CBD5E1"/>
      <circle cx="152" cy="62" r="6" fill="#CBD5E1"/>
      
      <!-- Content section 1 -->
      <rect x="12" y="130" width="176" height="1" fill="#E2E8F0"/>
      <rect x="12" y="145" width="80" height="50" rx="4" fill="#F1F5F9"/>
      <rect x="100" y="145" width="88" height="8" rx="2" fill="#CBD5E1"/>
      <rect x="100" y="159" width="80" height="6" rx="2" fill="#E2E8F0"/>
      <rect x="100" y="171" width="70" height="6" rx="2" fill="#E2E8F0"/>
      <rect x="100" y="183" width="75" height="6" rx="2" fill="#E2E8F0"/>
      
      ${blogSection}
      
      <!-- Footer -->
      <rect x="12" y="268" width="176" height="1" fill="#E2E8F0"/>
      
      <!-- Page count badge (only on front page) -->
      ${pageNumber === 1 ? `
        <circle cx="180" cy="265" r="12" fill="#3B82F6"/>
        <text x="180" y="269" text-anchor="middle" fill="white" font-size="11" font-weight="700">${totalPages}</text>
      ` : ''}
    </svg>
  `;
}

/**
 * Create blog section addon using hosted image
 * @returns {string} Image markup
 */
export function createBlogAddonSVG() {
  return `
    <img src="${ADDON_IMAGES.blog}" alt="Blog Section" class="tl-addon-image tl-blog-image" loading="lazy" />
  `;
}

/**
 * Create multilingual badge addon using hosted image
 * @returns {string} Image markup
 */
export function createMultilingualAddonSVG() {
  return `
    <img src="${ADDON_IMAGES.multilang}" alt="Multilingual" class="tl-addon-image tl-multilingual-image" loading="lazy" />
  `;
}

/**
 * Create CMS integration addon using hosted image
 * @returns {string} Image markup
 */
export function createCMSAddonSVG() {
  return `
    <img src="${ADDON_IMAGES.cms}" alt="CMS Integration" class="tl-addon-image tl-cms-image" loading="lazy" />
  `;
}

/**
 * Create SEO addon visualization using hosted image
 * @returns {string} Image markup
 */
export function createSEOAddonSVG() {
  return `
    <img src="${ADDON_IMAGES.seo}" alt="SEO Optimisation" class="tl-addon-image tl-seo-image" loading="lazy" />
  `;
}

/**
 * Create Analytics dashboard addon using hosted image
 * @returns {string} Image markup
 */
export function createAnalyticsAddonSVG() {
  return `
    <img src="${ADDON_IMAGES.analytics}" alt="Analytical Setup" class="tl-addon-image tl-analytics-image" loading="lazy" />
  `;
}

/**
 * Create Social Media post card wireframe
 * @param {number} index - Post index
 * @returns {string} SVG markup
 */
export function createSocialPostSVG(index = 1) {
  const colors = ['#E1306C', '#1DA1F2', '#0A66C2', '#FF0000'];
  const color = colors[(index - 1) % colors.length];
  
  return `
    <svg class="tl-social-post-svg" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Card background -->
      <rect x="1" y="1" width="178" height="218" rx="12" fill="white" stroke="#E2E8F0" stroke-width="2"/>
      
      <!-- Header -->
      <circle cx="24" cy="24" r="12" fill="${color}"/>
      <rect x="44" y="16" width="60" height="8" rx="2" fill="#1E293B"/>
      <rect x="44" y="28" width="40" height="6" rx="2" fill="#94A3B8"/>
      
      <!-- Image placeholder -->
      <rect x="12" y="48" width="156" height="100" rx="4" fill="#F1F5F9"/>
      <path d="M60 98 L90 78 L120 108 L150 88 L156 148 L12 148 Z" fill="#CBD5E1"/>
      <circle cx="50" cy="78" r="15" fill="#CBD5E1"/>
      
      <!-- Engagement bar -->
      <rect x="12" y="156" width="156" height="1" fill="#E2E8F0"/>
      <circle cx="28" cy="172" r="10" fill="#F1F5F9"/>
      <circle cx="56" cy="172" r="10" fill="#F1F5F9"/>
      <circle cx="84" cy="172" r="10" fill="#F1F5F9"/>
      
      <!-- Caption -->
      <rect x="12" y="190" width="140" height="6" rx="2" fill="#64748B"/>
      <rect x="12" y="202" width="100" height="6" rx="2" fill="#94A3B8"/>
      
      <!-- Post number -->
      <circle cx="160" cy="205" r="10" fill="${color}"/>
      <text x="160" y="209" text-anchor="middle" fill="white" font-size="10" font-weight="600">${index}</text>
    </svg>
  `;
}

/**
 * Create Recruiting job card wireframe
 * @param {number} index - Job index
 * @returns {string} SVG markup
 */
export function createJobCardSVG(index = 1) {
  return `
    <svg class="tl-job-card-svg" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Card background -->
      <rect x="1" y="1" width="198" height="138" rx="8" fill="white" stroke="#E2E8F0" stroke-width="2"/>
      
      <!-- Company logo placeholder -->
      <rect x="12" y="12" width="40" height="40" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <rect x="20" y="24" width="24" height="16" rx="2" fill="#CBD5E1"/>
      
      <!-- Job title -->
      <rect x="64" y="12" width="100" height="12" rx="2" fill="#1E293B"/>
      <rect x="64" y="30" width="70" height="8" rx="2" fill="#64748B"/>
      
      <!-- Tags -->
      <rect x="64" y="46" width="40" height="16" rx="8" fill="#DBEAFE"/>
      <rect x="110" y="46" width="50" height="16" rx="8" fill="#DCFCE7"/>
      
      <!-- Description lines -->
      <rect x="12" y="72" width="176" height="1" fill="#E2E8F0"/>
      <rect x="12" y="84" width="160" height="6" rx="2" fill="#CBD5E1"/>
      <rect x="12" y="96" width="140" height="6" rx="2" fill="#E2E8F0"/>
      <rect x="12" y="108" width="150" height="6" rx="2" fill="#E2E8F0"/>
      
      <!-- Apply button -->
      <rect x="12" y="120" width="80" height="24" rx="4" fill="#3B82F6"/>
      
      <!-- Job number -->
      <circle cx="180" cy="125" r="10" fill="#10B981"/>
      <text x="180" y="129" text-anchor="middle" fill="white" font-size="10" font-weight="600">${index}</text>
    </svg>
  `;
}

/**
 * Create Webapp interface wireframe
 * @param {number} moduleCount - Number of modules
 * @returns {string} SVG markup
 */
export function createWebappSVG(moduleCount = 1) {
  return `
    <svg class="tl-webapp-svg" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- App window -->
      <rect x="1" y="1" width="278" height="198" rx="8" fill="#1E293B" stroke="#475569" stroke-width="2"/>
      
      <!-- Title bar -->
      <rect x="1" y="1" width="278" height="24" rx="8" fill="#334155"/>
      <circle cx="16" cy="13" r="5" fill="#EF4444"/>
      <circle cx="32" cy="13" r="5" fill="#F59E0B"/>
      <circle cx="48" cy="13" r="5" fill="#22C55E"/>
      
      <!-- Sidebar -->
      <rect x="1" y="25" width="60" height="173" fill="#0F172A"/>
      <rect x="10" y="40" width="40" height="8" rx="2" fill="#475569"/>
      <rect x="10" y="56" width="40" height="6" rx="2" fill="#334155"/>
      <rect x="10" y="70" width="40" height="6" rx="2" fill="#334155"/>
      <rect x="10" y="84" width="40" height="6" rx="2" fill="#334155"/>
      <rect x="10" y="98" width="40" height="6" rx="2" fill="#3B82F6"/>
      
      <!-- Main content area -->
      <rect x="70" y="35" width="200" height="155" rx="4" fill="#F8FAFC"/>
      
      <!-- Module cards based on count -->
      ${moduleCount >= 1 ? '<rect x="80" y="45" width="85" height="65" rx="4" fill="white" stroke="#E2E8F0" stroke-width="1"/><rect x="90" y="55" width="40" height="6" rx="2" fill="#1E293B"/><rect x="90" y="67" width="65" height="4" rx="1" fill="#CBD5E1"/><rect x="90" y="77" width="55" height="4" rx="1" fill="#CBD5E1"/><rect x="90" y="95" width="50" height="10" rx="2" fill="#3B82F6"/>' : ''}
      ${moduleCount >= 2 ? '<rect x="175" y="45" width="85" height="65" rx="4" fill="white" stroke="#E2E8F0" stroke-width="1"/><rect x="185" y="55" width="40" height="6" rx="2" fill="#1E293B"/><rect x="185" y="67" width="65" height="4" rx="1" fill="#CBD5E1"/><rect x="185" y="77" width="55" height="4" rx="1" fill="#CBD5E1"/><rect x="185" y="95" width="50" height="10" rx="2" fill="#22C55E"/>' : ''}
      ${moduleCount >= 3 ? '<rect x="80" y="120" width="85" height="65" rx="4" fill="white" stroke="#E2E8F0" stroke-width="1"/><rect x="90" y="130" width="40" height="6" rx="2" fill="#1E293B"/><rect x="90" y="142" width="65" height="4" rx="1" fill="#CBD5E1"/><rect x="90" y="152" width="55" height="4" rx="1" fill="#CBD5E1"/><rect x="90" y="170" width="50" height="10" rx="2" fill="#F59E0B"/>' : ''}
      ${moduleCount >= 4 ? '<rect x="175" y="120" width="85" height="65" rx="4" fill="white" stroke="#E2E8F0" stroke-width="1"/><rect x="185" y="130" width="40" height="6" rx="2" fill="#1E293B"/><rect x="185" y="142" width="65" height="4" rx="1" fill="#CBD5E1"/><rect x="185" y="152" width="55" height="4" rx="1" fill="#CBD5E1"/><rect x="185" y="170" width="50" height="10" rx="2" fill="#8B5CF6"/>' : ''}
      
      <!-- Module count badge -->
      <circle cx="260" cy="185" r="12" fill="#3B82F6"/>
      <text x="260" y="189" text-anchor="middle" fill="white" font-size="10" font-weight="600">${moduleCount}</text>
    </svg>
  `;
}

/**
 * Create Automation flow wireframe
 * @param {number} nodeCount - Number of automation nodes
 * @returns {string} SVG markup
 */
export function createAutomationFlowSVG(nodeCount = 2) {
  const nodes = [];
  const connections = [];
  
  // Start node
  nodes.push(`
    <rect x="10" y="75" width="50" height="50" rx="25" fill="#22C55E"/>
    <text x="35" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="600">START</text>
  `);
  
  // Dynamic nodes based on count
  const nodePositions = [
    { x: 90, y: 50 },
    { x: 90, y: 100 },
    { x: 170, y: 75 },
    { x: 250, y: 50 },
    { x: 250, y: 100 },
    { x: 330, y: 75 }
  ];
  
  const nodeColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444'];
  const nodeLabels = ['Trigger', 'Filter', 'Action', 'Email', 'CRM', 'Notify'];
  
  for (let i = 0; i < Math.min(nodeCount, 6); i++) {
    const pos = nodePositions[i];
    const color = nodeColors[i];
    const label = nodeLabels[i];
    
    nodes.push(`
      <rect x="${pos.x}" y="${pos.y}" width="60" height="50" rx="8" fill="${color}"/>
      <text x="${pos.x + 30}" y="${pos.y + 30}" text-anchor="middle" fill="white" font-size="9" font-weight="500">${label}</text>
    `);
    
    // Connection from start to first nodes
    if (i === 0) {
      connections.push(`<path d="M60 100 Q75 75 90 75" stroke="#CBD5E1" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>`);
    }
    if (i === 1) {
      connections.push(`<path d="M60 100 Q75 125 90 125" stroke="#CBD5E1" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>`);
    }
    // Connections between nodes
    if (i === 2 && nodeCount > 2) {
      connections.push(`<path d="M150 75 L170 100" stroke="#CBD5E1" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>`);
      connections.push(`<path d="M150 125 L170 100" stroke="#CBD5E1" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>`);
    }
  }
  
  // End node
  nodes.push(`
    <rect x="340" y="75" width="50" height="50" rx="25" fill="#EF4444"/>
    <text x="365" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="600">END</text>
  `);
  
  return `
    <svg class="tl-automation-svg" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#CBD5E1"/>
        </marker>
      </defs>
      
      <!-- Background -->
      <rect x="1" y="1" width="398" height="198" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      
      <!-- Grid pattern -->
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="0.5"/>
      </pattern>
      <rect x="1" y="1" width="398" height="198" fill="url(#grid)"/>
      
      <!-- Connections -->
      ${connections.join('')}
      
      <!-- Nodes -->
      ${nodes.join('')}
      
      <!-- Node count -->
      <circle cx="380" cy="180" r="12" fill="#3B82F6"/>
      <text x="380" y="184" text-anchor="middle" fill="white" font-size="10" font-weight="600">${nodeCount}</text>
    </svg>
  `;
}

/**
 * Get addon SVG function by slug
 * @param {string} addonSlug - Addon slug
 * @returns {Function|null} SVG generator function
 */
export function getAddonSVGGenerator(addonSlug) {
  const generators = {
    'blog': createBlogAddonSVG,
    'multilang': createMultilingualAddonSVG,
    'cms': createCMSAddonSVG,
    'seo': createSEOAddonSVG,
    'analytics': createAnalyticsAddonSVG
  };
  
  return generators[addonSlug] || null;
}

/**
 * Create initial page image (used as base visualization)
 * @returns {string} Image markup
 */
export function createInitialPageImage() {
  return `
    <img src="${ADDON_IMAGES.initialPage}" alt="Page Preview" class="tl-addon-image tl-initial-page-image" loading="lazy" />
  `;
}

/**
 * Get addon image URL
 * @param {string} addonSlug - Addon slug
 * @returns {string|null} Image URL
 */
export function getAddonImageUrl(addonSlug) {
  return ADDON_IMAGES[addonSlug] || null;
}

// Export the addon images constant for use elsewhere
export { ADDON_IMAGES };

export default {
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
  getAddonImageUrl,
  ADDON_IMAGES
};
