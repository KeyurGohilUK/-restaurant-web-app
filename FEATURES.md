# Feature Roadmap

This file tracks the planned public-facing restaurant website. The current product is informational only: no online ordering, checkout, payments, delivery management, or customer accounts.

## Phase 1 — Foundation

- [x] Vite + TypeScript application bootstrap
- [x] Mobile-first responsive shell and navigation
- [x] Shared design tokens and reusable presentation patterns
- [x] GitHub Pages-compatible build configuration
- [x] CI for type checking, unit tests, production build, and browser tests
- [x] Automated GitHub Pages deployment from `main`
- [ ] Error/404 experience suitable for static hosting
- [x] Baseline accessibility and keyboard navigation

## Phase 2 — Core visitor experience

### Home
- [x] Hero section with restaurant positioning and primary calls to action
- [x] Signature dishes / highlights
- [ ] Short restaurant story
- [x] Opening-hours summary
- [x] Location/contact summary
- [x] Review trust signals / external rating summaries
- [x] Catering highlight

### Menu
- [x] Structured, data-driven menu
- [x] Menu categories and category navigation
- [x] Dish name, description and price
- [ ] Dish images where suitable approved assets are available
- [ ] Vegetarian/vegan/spice/dietary indicators where verified
- [ ] Dedicated allergen-information link/page
- [x] Allergen/dietary contact notice
- [x] Category filtering for faster browsing
- [x] Easy content maintenance without duplicating markup

### Reviews
- [x] Dedicated reviews section
- [x] Review categories: restaurant experience, catering, events, large orders
- [x] External rating summaries on the main site
- [x] Clear source attribution for externally sourced ratings
- [x] Links to original review platforms where appropriate
- [x] No fabricated or unattributed reviews
- [ ] Verified individual testimonials once approved source text is available

### Catering & Events
- [x] Catering overview/teaser on home page
- [ ] Event types supported
- [ ] Sample catering/menu options where approved
- [x] Enquiry/contact call to action
- [ ] Catering reviews/testimonials
- [ ] Optional downloadable catering information in a later phase

### About
- [ ] Restaurant/business story
- [ ] Cuisine and food philosophy
- [ ] Team/founder information where approved
- [ ] Values and differentiators

### Gallery
- [ ] Responsive image gallery
- [ ] Food, venue, catering and event categories
- [ ] Optimised responsive images
- [ ] Accessible alt text
- [ ] Optional lightbox only if it remains accessible and lightweight

### Contact & Location
- [x] Address and directions
- [x] Click-to-call/contact actions
- [x] Opening hours
- [x] Map link with graceful fallback
- [ ] Social links
- [ ] Accessibility information where available

### Dietary & Allergen Information
- [x] Clear allergen contact notice
- [ ] Verified dietary labels only
- [x] Contact guidance for allergen questions
- [x] Avoid unverified safety claims

## Phase 3 — Discoverability & trust

- [x] Initial page title and meta description
- [ ] Per-page titles and meta descriptions as routes/pages are added
- [ ] Canonical URLs
- [ ] Open Graph/social sharing metadata
- [ ] Restaurant/LocalBusiness structured data
- [ ] Consistent name/address/phone/opening-hours data across all future pages
- [ ] Sitemap
- [ ] robots.txt
- [ ] Favicon/app icons
- [ ] Privacy policy where required
- [ ] Cookie/consent handling only if tracking or non-essential cookies are introduced
- [ ] Performance/Core Web Vitals review
- [ ] Accessibility review targeting WCAG 2.2 AA

## Phase 4 — Optional future enhancements

These are not part of the initial release and require explicit approval.

- [ ] PWA/installability
- [ ] Offline access to key information/menu
- [ ] CMS or lightweight content-management workflow
- [ ] Contact/catering enquiry form with backend service
- [ ] Analytics with privacy/consent review
- [ ] Instagram/social content integration
- [ ] Multi-language support
- [ ] Custom domain migration from GitHub Pages

## Explicitly out of scope for now

- Online ordering
- Checkout
- Payment processing
- Delivery tracking/management
- Customer accounts
- Loyalty accounts/rewards
- Reservation engine
- Restaurant POS integration
