import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const serverBundlePath = path.resolve(distDir, 'server', 'entry-server.js');

const SITE_ORIGIN = 'https://www.aniheal.co.ke';

// Safe environment stubs
if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

async function fetchWithTimeout(url, timeoutMs = 2000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) return await res.json();
  } catch {
    clearTimeout(timeoutId);
  }
  return null;
}

async function loadBuildData() {
  const defaultContentPath = path.resolve(projectRoot, 'src', 'data', 'defaultContent.json');
  let fallbackData = {};
  try {
    fallbackData = JSON.parse(fs.readFileSync(defaultContentPath, 'utf-8'));
  } catch (err) {
    console.warn('⚠️ Could not load defaultContent.json:', err.message);
  }

  // Attempt live API fetch if local server or remote API is accessible
  const apiBase = process.env.VITE_API_BASE_URL || 'https://www.aniheal.co.ke/api';
  console.log(`📡 Checking for live content updates from ${apiBase}...`);

  try {
    const [settingsRes, blocksRes, servicesRes, productsRes, collabsRes] = await Promise.all([
      fetchWithTimeout(`${apiBase}/public/settings`),
      fetchWithTimeout(`${apiBase}/public/content/all`),
      fetchWithTimeout(`${apiBase}/public/services`),
      fetchWithTimeout(`${apiBase}/products`),
      fetchWithTimeout(`${apiBase}/collaborations`),
    ]);

    let mergedData = { ...fallbackData };

    if (settingsRes?.success && settingsRes.data) {
      mergedData.settings = settingsRes.data;
    }

    if (blocksRes?.success && blocksRes.data) {
      const bData = blocksRes.data;
      const blocksMap = {};
      if (bData.byKey && typeof bData.byKey === 'object') {
        Object.assign(blocksMap, bData.byKey);
      } else if (Array.isArray(bData.blocks)) {
        bData.blocks.forEach((b) => {
          if (b.key) blocksMap[b.key] = b;
        });
      } else if (Array.isArray(bData)) {
        bData.forEach((b) => {
          if (b.key) blocksMap[b.key] = b;
        });
      }
      if (Object.keys(blocksMap).length > 0) {
        mergedData.blocks = { ...mergedData.blocks, ...blocksMap };
      }
    }

    if (servicesRes?.success && Array.isArray(servicesRes.data) && servicesRes.data.length > 0) {
      mergedData.services = servicesRes.data;
    }

    if (productsRes?.success && Array.isArray(productsRes.data) && productsRes.data.length > 0) {
      mergedData.products = productsRes.data;
    }

    if (collabsRes?.success && Array.isArray(collabsRes.data) && collabsRes.data.length > 0) {
      mergedData.collaborations = collabsRes.data;
    }

    console.log('✔ Build content compiled successfully.');
    return mergedData;
  } catch (err) {
    console.log('ℹ Using baseline content snapshot for static generation.');
    return fallbackData;
  }
}

function getRouteMetadata(route, content) {
  const siteName = content.settings?.siteName || 'AniHeal Vetspace solutions';
  const defaultDesc =
    content.settings?.metaDescription ||
    'AniHeal is an accredited agro-veterinary enterprise advancing clinical diagnostics, preventative medicine, and precision livestock production across Kenya.';

  // Base routes
  if (route === '/') {
    return {
      title: `${siteName} | Veterinary & One Health Consultancy Kenya`,
      description: defaultDesc,
      isNoIndex: false,
    };
  }

  if (route === '/services') {
    return {
      title: 'Clinical Veterinary Services & Disease Control | AniHeal Kenya',
      description:
        'Specialized agro-pastoral and veterinary clinical services across Kenya. Accredited by the Kenya Veterinary Board for field ambulatory triage and disease control.',
      isNoIndex: false,
    };
  }

  if (route === '/products') {
    return {
      title: 'Veterinary Products, Vaccines & Supplies | AniHeal Kenya',
      description:
        'Browse KVB accredited veterinary pharmaceuticals, vaccines, livestock supplements, and diagnostic kits with farm delivery across Kenya.',
      isNoIndex: false,
    };
  }

  if (route === '/animal-insurance') {
    return {
      title: 'Animal Healthcare Insurance & Farm Retainers | AniHeal Kenya',
      description:
        'Comprehensive healthcare coverage for pets, livestock, and commercial herds across Kenya. Cashless emergency clinical interventions and preventative care.',
      isNoIndex: false,
    };
  }

  if (route === '/collaborations') {
    return {
      title: 'One Health Collaborations & Research Partnerships | AniHeal Kenya',
      description:
        'Explore AniHeal’s collaborative initiatives, community outreach programs, and One Health research partnerships across East Africa.',
      isNoIndex: false,
    };
  }

  if (route === '/appointment-booking') {
    return {
      title: 'Book a Veterinary Consultation or Farm Visit | AniHeal Kenya',
      description:
        'Schedule an on-farm veterinary visit or office consultation with AniHeal’s licensed veterinary specialists in Kenya.',
      isNoIndex: false,
    };
  }

  if (route === '/our-team') {
    return {
      title: 'Our Veterinary Doctors & Clinical Specialists | AniHeal Kenya',
      description:
        'Meet AniHeal’s accredited veterinary surgeons, livestock epidemiologists, and reproduction technicians serving farms across Kenya.',
      isNoIndex: false,
    };
  }

  if (route === '/contact-us') {
    return {
      title: 'Contact Us & 24/7 Field Ambulatory Triage | AniHeal Kenya',
      description:
        'Get in touch with AniHeal Vetspace solutions. 24/7 emergency veterinary hotline, clinic hubs in Nakuru, Eldoret, Nyeri, Kilifi, and nationwide ambulatory dispatch.',
      isNoIndex: false,
    };
  }

  if (route === '/404') {
    return {
      title: `Page Not Found | ${siteName}`,
      description: 'The requested veterinary resource or clinical page could not be located.',
      isNoIndex: true,
    };
  }

  // Dynamic Service Detail
  if (route.startsWith('/services/')) {
    const slug = route.replace('/services/', '');
    const service = (content.services || []).find((s) => s.slug === slug || s._id === slug || s.id === slug);
    if (service) {
      return {
        title: `${service.title || service.name} | AniHeal Clinical Services Kenya`,
        description:
          service.description?.slice(0, 155) ||
          `${service.title || service.name} - KVB accredited clinical protocol with farm dispatch across Kenya.`,
        isNoIndex: false,
      };
    }
  }

  // Dynamic Product Detail
  if (route.startsWith('/products/')) {
    const slug = route.replace('/products/', '');
    const product = (content.products || []).find((p) => p.slug === slug || p._id === slug);
    if (product) {
      return {
        title: `${product.name} | AniHeal Veterinary Products Kenya`,
        description:
          product.description?.slice(0, 155) ||
          `Order ${product.name} from AniHeal Vetspace. KVB accredited veterinary supplies with farm delivery in Kenya.`,
        isNoIndex: false,
      };
    }
  }

  // Dynamic Collaboration Detail
  if (route.startsWith('/collaborations/')) {
    const slug = route.replace('/collaborations/', '');
    const collab = (content.collaborations || []).find((c) => c.slug === slug || c._id === slug);
    if (collab) {
      return {
        title: `${collab.header || collab.title} | AniHeal Collaborations`,
        description:
          collab.summary?.slice(0, 155) ||
          collab.excerpt?.slice(0, 155) ||
          'Read about AniHeal’s One Health collaboration initiatives and field veterinary partnerships in Kenya.',
        isNoIndex: false,
      };
    }
  }

  return {
    title: `${siteName}`,
    description: defaultDesc,
    isNoIndex: false,
  };
}

async function runPrerender() {
  console.log('🚀 Starting AniHeal SEO Prerender Pipeline (React 19 + Vite 6)...');

  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory not found. Please run client build first: vite build');
  }

  if (!fs.existsSync(serverBundlePath)) {
    throw new Error(`Server bundle not found at ${serverBundlePath}`);
  }

  const templatePath = path.resolve(distDir, 'index.html');
  const indexTemplate = fs.readFileSync(templatePath, 'utf-8');

  const content = await loadBuildData();

  // Import the compiled server entry
  const { render } = await import(pathToFileURL(serverBundlePath).href);

  // Collect all public routes
  const routes = [
    '/',
    '/services',
    '/products',
    '/animal-insurance',
    '/collaborations',
    '/appointment-booking',
    '/our-team',
    '/contact-us',
    '/404',
  ];

  // Dynamic Services
  (content.services || []).forEach((s) => {
    const slug = s.slug || s._id;
    if (slug) routes.push(`/services/${slug}`);
  });

  // Dynamic Products
  (content.products || []).forEach((p) => {
    const slug = p.slug || p._id;
    if (slug) routes.push(`/products/${slug}`);
  });

  // Dynamic Collaborations
  (content.collaborations || []).forEach((c) => {
    const slug = c.slug || c._id;
    if (slug) routes.push(`/collaborations/${slug}`);
  });

  console.log(`📋 Total routes queued for static generation: ${routes.length}`);

  const results = [];

  for (const route of routes) {
    try {
      const meta = getRouteMetadata(route, content);
      const { html: appHtml } = await render(route, content);

      let pageHtml = indexTemplate;

      // Replace root div content
      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      // Replace title
      pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);

      // Build head tags
      const headTags = [];

      // Meta Description
      if (meta.description) {
        headTags.push(`  <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />`);
      }

      // Robots tag
      if (meta.isNoIndex) {
        headTags.push(`  <meta name="robots" content="noindex, nofollow" />`);
      }

      // Canonical and Open Graph tags
      // Strict rule: DO NOT put canonical or og:url in index.html (the SPA root fallback)
      if (route !== '/' && !meta.isNoIndex) {
        const canonicalUrl = `${SITE_ORIGIN}${route}`;
        headTags.push(`  <link rel="canonical" href="${canonicalUrl}" />`);
        headTags.push(`  <meta property="og:url" content="${canonicalUrl}" />`);
        headTags.push(`  <meta property="og:type" content="website" />`);
        headTags.push(`  <meta property="og:site_name" content="AniHeal Vetspace solutions" />`);
        headTags.push(`  <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />`);
        if (meta.description) {
          headTags.push(`  <meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />`);
        }
        headTags.push(`  <meta property="og:image" content="${SITE_ORIGIN}/logo.png" />`);
        headTags.push(`  <meta name="twitter:card" content="summary_large_image" />`);
        headTags.push(`  <meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />`);
        if (meta.description) {
          headTags.push(`  <meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />`);
        }
      }

      // Initial Content script for 0ms hydration
      const safeContentJson = JSON.stringify(content).replace(/</g, '\\u003c');
      headTags.push(`  <script id="__ANIHEAL_DATA__">window.__ANIHEAL_INITIAL_CONTENT__ = ${safeContentJson};</script>`);

      // Inject tags right before </head>
      pageHtml = pageHtml.replace('</head>', `${headTags.join('\n')}\n</head>`);

      // Output location
      let outputPath;
      if (route === '/') {
        outputPath = path.resolve(distDir, 'index.html');
      } else if (route === '/404') {
        outputPath = path.resolve(distDir, '404.html');
        // Also create /404/index.html
        const dir404 = path.resolve(distDir, '404');
        fs.mkdirSync(dir404, { recursive: true });
        fs.writeFileSync(path.resolve(dir404, 'index.html'), pageHtml, 'utf-8');
      } else {
        const routeDir = path.resolve(distDir, ...route.split('/').filter(Boolean));
        fs.mkdirSync(routeDir, { recursive: true });
        outputPath = path.resolve(routeDir, 'index.html');
      }

      fs.writeFileSync(outputPath, pageHtml, 'utf-8');
      const fileSizeKb = (Buffer.byteLength(pageHtml, 'utf-8') / 1024).toFixed(1);

      results.push({
        route,
        status: '✔ Generated',
        size: `${fileSizeKb} KB`,
        title: meta.title.slice(0, 50),
      });
    } catch (err) {
      console.error(`❌ Failed to prerender ${route}:`, err);
      results.push({
        route,
        status: '❌ Error',
        size: '-',
        title: err.message,
      });
    }
  }

  // Remove temporary dist/server bundle so Vercel doesn't publish unnecessary files
  const serverDir = path.resolve(distDir, 'server');
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
  }

  console.log('\n📊 Prerender Generation Summary:');
  console.table(results);
  console.log(`\n🎉 Prerendering complete! ${results.filter((r) => r.status.includes('✔')).length} pages generated.`);
}

runPrerender().catch((err) => {
  console.error('Fatal prerender failure:', err);
  process.exit(1);
});
