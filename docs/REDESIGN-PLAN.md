# LearnMap — Complete Redesign Plan

> Educational guidance platform for Jordanian Tawjihi students.
> Generated from full codebase audit of `learnmap.jo`.

---

## Table of Contents

1. [Code Audit](#1-code-audit)
2. [What Really Matters](#2-what-really-matters-for-this-site)
3. [Redesign Roadmap](#3-redesign-roadmap-phased)
4. [Skills & Tools](#4-skills--tools-to-accelerate-workflow)
5. [Effort & Priority Matrix](#5-effort--priority-matrix)

---

## 1. CODE AUDIT (What You Found)

### Tech Stack & Version Summary

| Layer | Technology | Details |
|-------|-----------|---------|
| Frontend | Vanilla HTML/CSS/JS | No framework, no build tool, no bundler |
| CSS | Single `styles.css` (5,975 lines) | CSS custom properties, dark mode via class toggle |
| JS | Vanilla ES5/ES6 mix | 8 client-side scripts, no modules, no imports |
| Backend | Node.js + Express 4.19 | ESM modules, MongoDB (Mongoose 8.5) |
| Auth | JWT + Google OAuth | `google-auth-library` 9.11 |
| Deployment | Netlify (frontend) + Render (backend) | Static site + API proxy |
| Font | Google Fonts (Cairo) | Loaded in navbar.html AND index.html (duplicate) |
| Images | WebP format, `.webm` video | 63 images, no `srcset`/`sizes` |

---

### Biggest UI/UX Problems

1. **Navbar loaded via `fetch()` on every page** (`index.html:194`, `interest-test.html:32`) — causes FOUC (Flash of Unstyled Content) and blocks rendering. The navbar HTML is 155 lines fetched at runtime.

2. **Dark mode is 1,200+ lines of `body.dark-mode .component` overrides** (`styles.css:4184-5362`) — every component has a duplicate dark mode rule. This is ~20% of the entire CSS file and is extremely fragile.

3. **Inconsistent spacing** — hardcoded values scattered throughout:
   - `styles.css:38`: `margin: var(--space-8) var(--space-4)` (hero)
   - `styles.css:1247`: `margin-top: -40px` (quick actions)
   - `styles.css:5557`: `margin-top: 10rem` (hero2-img mobile)
   - `styles.css:3612`: `gap: 2rem` (news-grid) while other grids use `var(--space-5)`

4. **Inline styles in HTML** — `index.html:33-106` contains 70+ lines of `<style>` for page-specific CSS. Subpages like `interest-test.html:9-27` also inject inline `<style>` blocks.

5. **Hardcoded color values** breaking design tokens:
   - `styles.css:1028`: `background: #4a6fa5` (hero blob)
   - `styles.css:1466`: `color: #00493f` (field card h3)
   - `styles.css:2466-2473`: `background-color: rgba(67, 160, 71, 0.1)` (demand rows)

6. **Container max-width is fixed at 1200px** (`styles.css:252`) with no `clamp()` or `container` queries. The hero grid uses fixed `1.2fr 1fr` columns.

---

### Performance Red Flags

1. **Navbar fetch blocks page paint** — Every page does `fetch("/components/navbar.html")` at load time, creating a visible delay.

2. **Google Fonts loaded twice** — Both `index.html:29` and `components/navbar.html:2` load the same Cairo font stylesheet.

3. **No image optimization pipeline** — All images are WebP but lack `srcset`, `sizes`, or responsive variants. The hero video (`hero-img.webm`) has `autoplay` without `preload="none"`.

4. **No CSS/JS minification** — `styles.css` is 5,975 lines unminified. All JS files are unminified.

5. **No build tool or bundler** — No Vite, Webpack, or any asset pipeline. No tree-shaking, no code splitting.

6. **Animation keyframes defined but unused** — `styles.css:1053-1076` defines `pulse`, `fadeInDown`, `slideInRight`, `float` — some are used, some are dead code.

7. **Third-party scripts without strategy** — Google Fonts loaded synchronously, Google OAuth script loaded on every page even if unused.

---

### Accessibility Violations

1. **Empty `alt` attributes on decorative images** — `index.html:278`: `alt=""` on field icons that are meaningful, not decorative.

2. **FAQ uses `<div>` + JS toggle instead of `<details>/<summary>`** — `styles.css:2366-2411` shows FAQ items with `display:none` toggled by JavaScript, not semantic HTML.

3. **Dark mode toggle lacks `aria-pressed`** — `components/navbar.html:81`: `aria-pressed="false"` is set but never updated in `dark-mode-controller.js`.

4. **Video has no captions or fallback** — `index.html:218`: `<video>` with no `<track>` element and no text alternative.

5. **Table columns hidden on mobile without notice** — `styles.css:5694-5699`: table columns 2 and 5 are `display:none` on mobile, potentially hiding important information.

6. **No `lang` attribute on dynamic content** — The entire site is `lang="ar"` but English content (like "LearnMap") isn't marked with `lang="en"`.

---

### SEO/HTML Semantics Issues

1. **Sitemap URLs don't match actual file paths** — `sitemap.xml:32` lists `/Fields-Awareness/Academic/science-and-technology-field.html` but the actual path is `/fields-awareness/academic/science-and-technology-field.html` (lowercase).

2. **robots.txt contradicts itself** — `robots.txt:8` says `Disallow: *` then `robots.txt:11-14` says `Allow: /Fields-Awareness/` (different case than actual paths).

3. **OG image may not exist** — `index.html:16`: `og:image` points to `/images/og-image.png` but the images directory has no `og-image.png`.

4. **Duplicate canonical URLs** — Some subpages reference `https://learnmap.jo/` while sitemap references `https://learnmapjo.netlify.app/`.

5. **Missing meta tags on subpages** — Subpages like `interest-test.html` have minimal meta tags (no OG, no Twitter cards).

6. **Structured data only on homepage** — `index.html:107-160` has JSON-LD but no other pages have structured data.

---

### Code Organisation Problems

1. **Monolithic CSS file** — 5,975 lines in a single `styles.css` with no logical separation (base, components, dark mode, responsive, subpages).

2. **Inline styles in HTML** — `index.html:33-106` has 70+ lines of page-specific CSS that should be in a separate file.

3. **No design tokens file** — Colors, spacing, typography are defined in `:root` but the system isn't extracted into a reusable token file.

4. **Duplicate Python scripts** — `fix_css_variables.py`, `update_colors.py`, `update_html_colors.py` are one-off scripts that should be in a `/scripts` directory.

5. **Secret file in repo** — `auth/client_secret_402464028647-htk3m8ae4v6d15dd8e8srqnpur2g9od5.apps.googleusercontent.com.json` is committed to the repository.

6. **No component system** — Components are HTML fragments loaded via `fetch()`, not proper reusable components.

---

### State Management & Data-Fetching Antipatterns

1. **Auth state via localStorage polling** — `components/navbar.html:127-138` uses `setTimeout(tryCheckAuth, 100)` to poll for auth state, creating race conditions.

2. **No error boundaries** — Failed `fetch()` calls for navbar/footer show only `console.error()` (`index.html:197`).

3. **Test results saved without offline support** — `auth.js:129-134` saves results via API call with no fallback for offline users.

4. **No request deduplication** — Multiple components may call the same API endpoint independently.

---

## 2. WHAT REALLY MATTERS FOR THIS SITE

### Site Type

Educational guidance platform for Jordanian Tawjihi (high school) students. Free, public-service oriented. Content-heavy with interactive assessments.

### Top 5 Success Factors

| # | Factor | Why It Matters | Current Status |
|---|--------|---------------|----------------|
| 1 | **Mobile-first load speed** | 80%+ of target users are on mobile in Jordan; slow 3G connections common | **FAILING** — navbar fetch, unminified CSS/JS, no image optimization, no build pipeline |
| 2 | **Core Web Vitals (LCP, CLS, FID)** | Google ranking factor; directly impacts user retention | **FAILING** — FOUC from navbar fetch causes layout shifts; no preloading strategy |
| 3 | **Content discoverability & trust** | Students need to find the right information quickly; trust the guidance | **PARTIAL** — Good content structure but broken sitemap/robots.txt; missing structured data |
| 4 | **Accessibility for all students** | Legal requirement; inclusive design for students with disabilities | **PARTIAL** — Skip link exists, focus states defined, but ARIA gaps, no semantic FAQ, hidden table columns |
| 5 | **Interactive assessment completion** | Core value proposition — the interest test drives engagement and return visits | **PARTIAL** — Test works but auth-gated; no offline save; results only via API |

### How the Redesign Fixes Each

1. **Mobile speed**: Eliminate navbar fetch (inline or SSR), add build pipeline with minification, implement responsive images
2. **Core Web Vitals**: Inline critical CSS, eliminate FOUC, add `content-visibility` for below-fold sections
3. **Trust/SEO**: Fix sitemap URLs, add structured data to all pages, fix robots.txt, add proper OG tags
4. **Accessibility**: Semantic HTML for FAQ, proper ARIA throughout, test with axe-core
5. **Assessment UX**: Remove auth gate for test start, add localStorage save, show partial results without login

---

## 3. REDESIGN ROADMAP (Phased)

### Phase 1 — Design Foundation & System

**Goal**: Extract and formalize the design system; create reusable component tokens.

**Files to touch:**
- `styles.css` → Extract `:root` variables into `tokens.css`
- Create `css/tokens.css` (design tokens)
- Create `css/base.css` (reset, typography, utilities)
- Create `css/components.css` (buttons, cards, forms, nav)
- Create `css/dark-mode.css` (refactored dark mode)
- Create `css/responsive.css` (all media queries)
- Create `css/animations.css` (keyframes, transitions)

**Specific changes:**

1. **Extract design tokens** from `styles.css:21-136`:
   ```css
   /* tokens.css */
   :root {
     /* Colors - rename gold-primary to accent-primary */
     --accent-primary: #147079;
     --accent-secondary: #1a8a94;
     --accent-cta: #DEB253;
     
     /* Surfaces */
     --surface-1: #f0fdfa;
     --surface-2: #FFFFFF;
     --surface-3: #e6f4f5;
     
     /* Text */
     --text-1: #0b1926;
     --text-2: #334155;
     --text-3: #64748b;
     
     /* Semantic */
     --color-success: #147079;
     --color-warning: #DEB253;
     --color-danger: #dc2626;
   }
   ```

2. **Refactor dark mode** — Replace 1,200+ lines of `body.dark-mode .component` overrides with CSS custom property reassignment:
   ```css
   body.dark-mode {
     --surface-1: #0b1926;
     --surface-2: #132235;
     --surface-3: #1c3352;
     --text-1: #f0fdfa;
     --text-2: #cbd5e1;
     --text-3: #94a3b8;
     --accent-primary: #DEB253;
   }
   ```
   This eliminates ~1,000 lines of CSS.

3. **Create component classes** — Extract from scattered styles:
   - `.btn` base class with `.btn-primary`, `.btn-secondary`, `.btn-ghost`
   - `.card` base with `.card-elevated`, `.card-bordered`
   - `.input`, `.select`, `.textarea` form components

4. **Fix hardcoded colors** — Replace all hardcoded values:
   - `#4a6fa5` → `var(--accent-primary)`
   - `#00493f` → `var(--text-1)`
   - `rgba(67, 160, 71, 0.1)` → `var(--color-success-bg)`

**Deliverable**: 6 focused CSS files replacing the monolithic `styles.css`. Consistent token usage across all files. Dark mode reduced from 1,200+ lines to ~50 lines of property overrides.

---

### Phase 2 — Layout & Responsive Rebuild

**Goal**: Mobile-first responsive system with modern CSS layout.

**Files to touch:**
- `components/navbar.html` → Inline critical navbar HTML
- `styles.css` (→ `css/responsive.css`)
- All HTML files for container/grid updates
- `components/footer.html`

**Specific changes:**

1. **Eliminate navbar fetch** — Move navbar HTML inline into each page (or create a build step that injects it). The current approach (`fetch("/components/navbar.html")`) causes FOUC on every page.

2. **Replace fixed-width containers** with fluid constraints:
   ```css
   .container {
     width: min(100% - 2rem, 1200px);
     margin-inline: auto;
     padding-inline: var(--space-4);
   }
   ```

3. **Convert hero grid** from `grid-template-columns: 1.2fr 1fr` to:
   ```css
   .hero-container {
     display: grid;
     grid-template-columns: 1fr;
     gap: var(--space-8);
   }
   @media (min-width: 768px) {
     .hero-container {
       grid-template-columns: 1.2fr 1fr;
       gap: var(--space-12);
     }
   }
   ```

4. **Unify spacing** — Replace all hardcoded spacing:
   - `margin-top: -40px` → `margin-top: calc(-1 * var(--space-10))`
   - `margin-top: 10rem` → `margin-top: var(--space-24)`
   - `gap: 2rem` → `gap: var(--space-8)`

5. **Mobile menu refactor** — The current mobile menu (`styles.css:5421-5550`) uses `position: fixed` with `right: -85vw`. Modernize with CSS `@starting-style` and `transition-behavior: allow-discrete` for entry/exit animations.

6. **Add container queries** for card components that need to adapt to their container width rather than viewport.

**Deliverable**: True mobile-first layout. All pages use fluid containers. Hero section stacks on mobile. No fixed-width elements. Consistent spacing scale throughout.

---

### Phase 3 — Performance & Core Web Vitals

**Goal**: Achieve LCP < 2.5s, CLS < 0.1, FID < 100ms.

**Files to touch:**
- All HTML files (add resource hints, inline critical CSS)
- `images/` directory (add responsive variants)
- `netlify.toml` (add headers, compression)
- All JS files (add `defer`, `async` where appropriate)
- Create `css/critical.css` (inlined in `<head>`)

**Specific changes:**

1. **Inline critical CSS** — Extract above-fold styles into `css/critical.css` and inline in `<head>`:
   ```html
   <style>/* critical.css content */</style>
   <link rel="stylesheet" href="/css/main.css" media="print" onload="this.media='all'">
   ```

2. **Implement responsive images** — Add `srcset` and `sizes` to all images:
   ```html
   <img src="/images/field-icon-1.webp" 
        srcset="/images/field-icon-1-300.webp 300w,
                /images/field-icon-1-600.webp 600w"
        sizes="(max-width: 768px) 100vw, 50vw"
        alt="..." loading="lazy" decoding="async">
   ```

3. **Fix font loading** — Remove duplicate Google Fonts load. Use `font-display: swap` (already set). Add `<link rel="preconnect">` to origin, not just Google.

4. **Defer non-critical scripts** — Current scripts in `index.html:535-538`:
   ```html
   <script src="/welcome-folat.js" defer></script>
   <script src="/dark-mode-controller.js" defer></script>
   <script src="/components/mobile-menu.js" defer></script>
   <script src="/slide.js" defer></script>
   ```
   Move `welcome-folat.js` and `slide.js` to loaded after `DOMContentLoaded`.

5. **Add resource hints** to `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="dns-prefetch" href="https://learnmap-api.onrender.com">
   ```

6. **Add `content-visibility: auto`** for below-fold sections:
   ```css
   .awareness-section { content-visibility: auto; contain-intrinsic-size: 0 500px; }
   ```

7. **Optimize Netlify config** — Add Brotli compression, proper cache headers for HTML (short), CSS/JS (long with hash), images (immutable).

8. **Minify assets** — Add a simple build script using `esbuild` or `terser` for JS and `csso` for CSS. No need for a full framework migration.

**Deliverable**: LCP < 2.5s on mobile. CLS near 0 (no FOUC from navbar fetch). All images responsive. Scripts deferred. Critical CSS inlined.

---

### Phase 4 — Accessibility & SEO Hardening

**Goal**: WCAG 2.1 AA compliance. Full SEO optimization.

**Files to touch:**
- All HTML files (heading hierarchy, ARIA, semantic HTML)
- `robots.txt` (fix case mismatches)
- `sitemap.xml` (fix URLs, add all pages)
- `auth/client_secret_*.json` → move to `.gitignore`
- `career-guidance/interest-test.html` → semantic FAQ

**Specific changes:**

1. **Fix heading hierarchy** — Ensure every page has exactly one `<h1>`, proper `<h2>`→`<h3>` nesting. Current issue: some subpages have `<h2>` as first heading.

2. **Add skip-to-content link** — Already exists (`styles.css:164-183`) but ensure it works on ALL pages (currently only on `index.html`).

3. **Fix dark mode toggle ARIA** — `dark-mode-controller.js:41` sets `aria-label` but never updates `aria-pressed`:
   ```javascript
   button.setAttribute('aria-pressed', isDark.toString());
   ```

4. **Convert FAQ to semantic HTML** — Replace `<div class="faq-item">` + JS toggle with:
   ```html
   <details class="faq-item">
     <summary class="faq-question">...</summary>
     <div class="faq-answer">...</div>
   </details>
   ```

5. **Fix robots.txt** — Match case to actual file paths:
   ```
   Allow: /fields-awareness/
   Allow: /career-guidance/
   Allow: /community/
   Allow: /decisions/
   ```

6. **Fix sitemap.xml** — Update all URLs to match actual lowercase paths and add all missing pages (there are ~70 HTML files but only ~50 in sitemap).

7. **Add structured data to subpages** — Each field page, university page, and test page should have appropriate schema.org markup.

8. **Fix OG tags** — Ensure `og-image.png` exists, add OG tags to all subpages, use consistent canonical URLs (`learnmap.jo` not `learnmapjo.netlify.app`).

9. **Add `aria-live` regions** for dynamic content (test questions, results).

10. **Remove committed secret** — `auth/client_secret_402464028647-htk3m8ae4v6d15dd8e8srqnpur2g9od5.apps.googleusercontent.com.json` should be in `.gitignore` and removed from git history.

**Deliverable**: Pass axe-core scan with 0 violations. Lighthouse accessibility score > 95. Correct robots.txt and sitemap. No secrets in repo. Proper structured data on key pages.

---

### Phase 5 — Modern UI/UX Polish & Micro-interactions

**Goal**: Delightful, polished user experience with subtle animations.

**Files to touch:**
- `css/animations.css` (new file for all animations)
- `index.html` (hero section refinements)
- `career-guidance/interest-test.html` (test UX)
- All page templates (loading states, empty states)

**Specific changes:**

1. **Page transitions** — Add crossfade between pages using View Transitions API:
   ```javascript
   document.addEventListener('click', (e) => {
     const link = e.target.closest('a');
     if (link && link.hostname === location.hostname) {
       e.preventDefault();
       document.startViewTransition(() => {
         location.href = link.href;
       });
     }
   });
   ```

2. **Loading skeletons** — Add skeleton screens for test questions and results:
   ```css
   .skeleton {
     background: linear-gradient(90deg, var(--surface-3) 25%, var(--surface-2) 50%, var(--surface-3) 75%);
     background-size: 200% 100%;
     animation: skeleton-shimmer 1.5s infinite;
   }
   ```

3. **Hover micro-interactions** — Current cards have `transform: translateY(-6px)` which is too aggressive. Reduce to `-3px` and add `will-change: transform` only on hover.

4. **Reduced motion support** — Already exists (`styles.css:5793-5822`) but ensure all animations respect `prefers-reduced-motion`.

5. **Empty states** — Add friendly empty states for search results, test history, and university matcher with illustrations.

6. **Dark mode transition** — Add smooth transition when toggling dark mode:
   ```css
   body { transition: background-color 0.3s, color 0.3s; }
   ```

7. **Progress indicators** — Add animated progress bar for test questions with smooth width transition.

**Deliverable**: Polished micro-interactions. Loading skeletons. Smooth dark mode toggle. Respect for reduced motion. Empty state illustrations.

---

## 4. SKILLS & TOOLS TO ACCELERATE WORKFLOW

Given this is a **vanilla HTML/CSS/JS** site (no React/Vue/Svelte), here are the specific tools:

### Build & Dev Tooling

- **Vite** — Add as dev server and build tool. Zero-config for vanilla HTML. Instant HMR. `npm init vite@latest . -- --template vanilla`
- **esbuild** — For JS minification in build step. 10-100x faster than webpack.
- **csso** — CSS minification. Reduces `styles.css` from ~200KB to ~60KB.
- **Prettier + ESLint** — `prettier --write .` and `eslint` with `eslint-plugin-html` for inline scripts.

### Design Token Pipeline

- **Style Dictionary** — Convert `tokens.css` variables into platform-specific outputs (CSS, JS constants).
- **Figma Tokens plugin** — If design is done in Figma, export tokens directly to CSS custom properties.

### Accessibility

- **axe-core** — `npm i -D axe-core` and add to test script. Run on every page.
- **Lighthouse CI** — `npm i -D @lhci/cli` for automated Lighthouse audits in CI.
- **eslint-plugin-jsx-a11y** — Even for vanilla JS, can catch ARIA issues.

### Visual Regression

- **Chromatic** — If moving to Storybook for component documentation.
- **Percy** — BrowserStack's visual testing tool.

### AI-Assisted Refactoring

- **Batch class renaming**: Use grep + sed to rename `gold-primary` → `accent-primary` across all files.
- **SCSS-to-CSS conversion**: Already CSS, but can convert to CSS nesting (`&` syntax) for modern browsers.
- **Dark mode refactor**: AI can analyze all `body.dark-mode .component` rules and generate the token-based override approach.
- **Component extraction**: AI can scan all HTML files for repeated patterns (cards, buttons) and generate a component reference.

### Recommended Workflow

```bash
# 1. Add Vite
npm init -y
npm i -D vite

# 2. Create build script
# package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write ."
}

# 3. Add to vite.config.js
export default {
  root: '.',
  build: {
    outDir: 'dist',
    minify: 'esbuild'
  }
}
```

---

## 5. EFFORT & PRIORITY MATRIX

| Phase | Complexity | Impact | Order | Parallelisable? |
|-------|-----------|--------|-------|----------------|
| Phase 1: Design Foundation | 3/5 | 5/5 | 1st | No (foundation) |
| Phase 2: Layout Rebuild | 4/5 | 4/5 | 2nd | Partially (with Phase 1) |
| Phase 3: Performance | 4/5 | 5/5 | 3rd | Yes (images + scripts in parallel) |
| Phase 4: Accessibility/SEO | 3/5 | 4/5 | 4th | Yes (SEO + a11y independent) |
| Phase 5: Polish | 2/5 | 3/5 | 5th | Yes (all independent) |

---

### Minimum Viable Redesign (80% Value, ~2 weeks)

**Step 1** (Day 1-2): Inline the navbar HTML into all page templates. This alone eliminates FOUC and improves LCP significantly.

**Step 2** (Day 2-3): Refactor dark mode to use CSS custom property overrides. This reduces `styles.css` by ~1,000 lines and makes the system maintainable.

**Step 3** (Day 3-4): Add a minimal build step with Vite + esbuild. Minify CSS and JS. This reduces file sizes by 60-70%.

**Step 4** (Day 4-5): Fix `robots.txt` and `sitemap.xml` case mismatches. Add missing OG tags to subpages. Fix the committed secret file.

**Step 5** (Day 5-6): Add `srcset`/`sizes` to the top 20 most-used images. Add `loading="lazy"` to all below-fold images.

**Step 6** (Day 6-7): Add skip-to-content links to all subpages. Fix `aria-pressed` on dark mode toggle. Convert FAQ to `<details>/<summary>`.

**Step 7** (Day 7-8): Inline critical CSS. Add `defer` to non-critical scripts. Add `content-visibility: auto` to fold sections.

**Deliverable after MVP**: No FOUC, 60%+ smaller assets, proper SEO indexing, basic accessibility compliance, maintainable dark mode system. This captures ~80% of the redesign value in ~8 working days.
