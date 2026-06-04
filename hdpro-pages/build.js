#!/usr/bin/env node
/**
 * HD Pro Cleaning — Page Builder
 * Generates all service pages from template.html + pages.json
 *
 * Usage:
 *   node build.js                 → builds all pages into /dist/pages/
 *   node build.js air-duct-repair → builds only that one page
 */

const fs   = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const TEMPLATE_FILE = path.join(__dirname, 'template.html');
const PAGES_FILE    = path.join(__dirname, 'pages.json');
const OUT_DIR       = path.join(__dirname, 'dist', 'pages');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Replace all {{key}} tokens in a template string */
function fill(template, tokens) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    tokens[key] !== undefined ? tokens[key] : `{{${key}}}`
  );
}

/** Build gallery items HTML */
function buildGallery(items) {
  return items.map(item => `
        <div class="gallery-item">
          <img src="/assets/img/hvdac.jpg" alt="${esc(item.title)}">
          <div class="gallery-content">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.desc)}</p>
          </div>
        </div>`).join('\n');
}

/** Build process steps HTML */
function buildSteps(steps) {
  return steps.map(s => `
      <div class="hww-card">
        <div class="hww-content">
          <div class="hww-icon-circle">${s.icon}</div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.desc)}</p>
        </div>
      </div>`).join('\n');
}

/** Build benefit cards HTML */
function buildBenefits(benefits) {
  return benefits.map(b => `
      <div class="service-card">
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.desc)}</p>
      </div>`).join('\n');
}

/** Build why-choose-us bullet points */
function buildWhyPoints(points) {
  return points.map(p => `<li>✔ ${esc(p)}</li>`).join('\n          ');
}

/** Build FAQ cards HTML */
function buildFAQs(faqs) {
  return faqs.map(f => `
      <div class="service-card">
        <h3>${esc(f.q)}</h3>
        <p>${esc(f.a)}</p>
      </div>`).join('\n');
}

/** Basic HTML escaping (the JSON data is trusted but let's be safe) */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Main ─────────────────────────────────────────────────────────────────────

function buildPage(page, template) {
  const tokens = {
    // Pass-through scalars
    title:          page.title,
    metaDescription:page.metaDescription,
    metaKeywords:   page.metaKeywords,
    canonical:      page.canonical,
    heroTitle:      page.heroTitle,
    heroSubtitle:   page.heroSubtitle,
    heroImage:      page.heroImage,
    introTitle:     page.introTitle,
    introP1:        page.introP1,
    introP2:        page.introP2,
    galleryTitle:   page.galleryTitle,
    processTitle:   page.processTitle,
    processSubtitle:page.processSubtitle,
    benefitsTitle:  page.benefitsTitle,
    whyTitle:       page.whyTitle,
    whyDesc:        page.whyDesc,
    ctaTitle:       page.ctaTitle,
    ctaDesc:        page.ctaDesc,
    ogTitle:        page.ogTitle,
    ogDesc:         page.ogDesc,

    // Rendered HTML blocks
    galleryItems:   buildGallery(page.galleryItems),
    processSteps:   buildSteps(page.processSteps),
    benefits:       buildBenefits(page.benefits),
    whyPoints:      buildWhyPoints(page.whyPoints),
    faqs:           buildFAQs(page.faqs),
  };

  return fill(template, tokens);
}

function run() {
  // Ensure output directory exists
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  const pages    = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));

  // Optional: filter to a single slug passed as CLI arg
  const target = process.argv[2];
  const toProcess = target ? pages.filter(p => p.slug === target) : pages;

  if (target && toProcess.length === 0) {
    console.error(`❌  No page found with slug: ${target}`);
    process.exit(1);
  }

  let built = 0;
  for (const page of toProcess) {
    const html     = buildPage(page, template);
    const outFile  = path.join(OUT_DIR, `${page.slug}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`✅  Built → dist/pages/${page.slug}.html`);
    built++;
  }

  console.log(`\n🎉  Done! ${built} page(s) written to dist/pages/`);
}

run();
