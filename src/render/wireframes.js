/**
 * Wireframe Components - SVG-based visual representations for each service
 */

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
 * Create blog section addon for wireframe
 * @returns {string} SVG markup
 */
export function createBlogAddonSVG() {
  return `
    <div class="tl-addon-overlay tl-addon-blog">
      <svg class="tl-blog-svg" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Blog section header -->
        <rect x="0" y="0" width="180" height="80" rx="4" fill="#F0FDF4" stroke="#22C55E" stroke-width="1" stroke-dasharray="4 2"/>
        <text x="90" y="12" text-anchor="middle" fill="#22C55E" font-size="8" font-weight="600">BLOG</text>
        
        <!-- Blog post 1 -->
        <rect x="8" y="20" width="50" height="35" rx="2" fill="#E2E8F0"/>
        <rect x="8" y="58" width="40" height="5" rx="1" fill="#94A3B8"/>
        <rect x="8" y="66" width="50" height="3" rx="1" fill="#CBD5E1"/>
        
        <!-- Blog post 2 -->
        <rect x="65" y="20" width="50" height="35" rx="2" fill="#E2E8F0"/>
        <rect x="65" y="58" width="40" height="5" rx="1" fill="#94A3B8"/>
        <rect x="65" y="66" width="50" height="3" rx="1" fill="#CBD5E1"/>
        
        <!-- Blog post 3 -->
        <rect x="122" y="20" width="50" height="35" rx="2" fill="#E2E8F0"/>
        <rect x="122" y="58" width="40" height="5" rx="1" fill="#94A3B8"/>
        <rect x="122" y="66" width="50" height="3" rx="1" fill="#CBD5E1"/>
      </svg>
    </div>
  `;
}

/**
 * Create multilingual badge addon
 * @returns {string} SVG markup
 */
export function createMultilingualAddonSVG() {
  return `
    <svg class="tl-multilingual-svg" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="24" rx="4" fill="#3B82F6"/>
      <text x="30" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="600">DE | EN</text>
    </svg>
  `;
}

/**
 * Create CMS integration addon (collection icon connected to wireframe)
 * @returns {string} SVG markup
 */
export function createCMSAddonSVG() {
  return `
    <svg class="tl-cms-svg" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Connection line -->
      <path d="M0 30 L30 30" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="4 2"/>
      
      <!-- CMS Collection Icon -->
      <rect x="30" y="5" width="65" height="50" rx="6" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
      
      <!-- Collection items -->
      <rect x="38" y="13" width="49" height="10" rx="2" fill="#DDD6FE"/>
      <rect x="38" y="27" width="49" height="10" rx="2" fill="#DDD6FE"/>
      <rect x="38" y="41" width="49" height="10" rx="2" fill="#DDD6FE"/>
      
      <!-- Database icon -->
      <circle cx="44" cy="18" r="3" fill="#8B5CF6"/>
      <circle cx="44" cy="32" r="3" fill="#8B5CF6"/>
      <circle cx="44" cy="46" r="3" fill="#8B5CF6"/>
      
      <!-- Lines representing data -->
      <rect x="50" y="16" width="30" height="4" rx="1" fill="#A78BFA"/>
      <rect x="50" y="30" width="25" height="4" rx="1" fill="#A78BFA"/>
      <rect x="50" y="44" width="32" height="4" rx="1" fill="#A78BFA"/>
    </svg>
  `;
}

/**
 * Create SEO addon visualization
 * @returns {string} SVG markup
 */
export function createSEOAddonSVG() {
  return `
    <svg class="tl-seo-svg" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Search icon background -->
      <circle cx="25" cy="25" r="24" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
      
      <!-- Magnifying glass -->
      <circle cx="22" cy="22" r="10" fill="none" stroke="#F59E0B" stroke-width="3"/>
      <line x1="29" y1="29" x2="38" y2="38" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      
      <!-- #1 badge -->
      <circle cx="38" cy="12" r="10" fill="#22C55E"/>
      <text x="38" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="700">#1</text>
    </svg>
  `;
}

/**
 * Create Analytics dashboard addon
 * @returns {string} SVG markup
 */
export function createAnalyticsAddonSVG() {
  return `
    <svg class="tl-analytics-svg" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Dashboard background -->
      <rect x="0" y="0" width="200" height="80" rx="6" fill="#F8FAFC" stroke="#64748B" stroke-width="1"/>
      
      <!-- Title -->
      <rect x="8" y="8" width="60" height="8" rx="2" fill="#64748B"/>
      
      <!-- Chart 1 - Bar chart -->
      <rect x="8" y="24" width="55" height="48" rx="4" fill="#E2E8F0"/>
      <rect x="14" y="50" width="8" height="16" rx="1" fill="#3B82F6"/>
      <rect x="26" y="40" width="8" height="26" rx="1" fill="#3B82F6"/>
      <rect x="38" y="32" width="8" height="34" rx="1" fill="#3B82F6"/>
      <rect x="50" y="44" width="8" height="22" rx="1" fill="#3B82F6"/>
      
      <!-- Chart 2 - Line chart -->
      <rect x="72" y="24" width="55" height="48" rx="4" fill="#E2E8F0"/>
      <polyline points="78,60 90,50 102,55 114,40 120,45" fill="none" stroke="#22C55E" stroke-width="2"/>
      <circle cx="78" cy="60" r="3" fill="#22C55E"/>
      <circle cx="90" cy="50" r="3" fill="#22C55E"/>
      <circle cx="102" cy="55" r="3" fill="#22C55E"/>
      <circle cx="114" cy="40" r="3" fill="#22C55E"/>
      <circle cx="120" cy="45" r="3" fill="#22C55E"/>
      
      <!-- Stats boxes -->
      <rect x="136" y="24" width="56" height="20" rx="4" fill="#DBEAFE"/>
      <text x="164" y="38" text-anchor="middle" fill="#3B82F6" font-size="10" font-weight="600">1,234</text>
      
      <rect x="136" y="52" width="56" height="20" rx="4" fill="#DCFCE7"/>
      <text x="164" y="66" text-anchor="middle" fill="#22C55E" font-size="10" font-weight="600">+24%</text>
    </svg>
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
  getAddonSVGGenerator
};
